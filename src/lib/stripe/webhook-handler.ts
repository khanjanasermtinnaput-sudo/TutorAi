import type Stripe from "stripe";
import { getStripe } from "./client";

export function constructStripeEvent(rawBody: string, signature: string, webhookSecret: string): Stripe.Event {
  return getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
}

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "inactive";
export type SubscriptionTier = "free" | "pro" | "max";

export interface SubscriptionUpdate {
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
}

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
      return "canceled";
    default:
      return "inactive";
  }
}

/** Pure event -> DB-write mapping, no I/O — the price->tier map is injected
 * (rather than read from env inside this function) so it's testable without
 * mocking process.env, matching this codebase's ai-router/quiz-generator DI
 * pattern. Returns null for event types this app doesn't act on. */
export function resolveSubscriptionUpdate(
  event: Stripe.Event,
  priceIdToTier: Record<string, "pro" | "max">,
): SubscriptionUpdate | null {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const tier = session.metadata?.tier;
      if (
        typeof session.customer !== "string" ||
        (tier !== "pro" && tier !== "max")
      ) {
        return null;
      }
      return {
        stripeCustomerId: session.customer,
        stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
        subscriptionTier: tier,
        subscriptionStatus: "active",
      };
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      if (typeof subscription.customer !== "string") return null;

      const priceId = subscription.items.data[0]?.price?.id;
      const tier = priceId ? priceIdToTier[priceId] : undefined;
      const isDeleted = event.type === "customer.subscription.deleted";

      return {
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        subscriptionTier: isDeleted ? "free" : (tier ?? "free"),
        subscriptionStatus: isDeleted ? "canceled" : mapStripeStatus(subscription.status),
      };
    }

    default:
      return null;
  }
}
