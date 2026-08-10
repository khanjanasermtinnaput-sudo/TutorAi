import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { constructStripeEvent, resolveSubscriptionUpdate } from "@/lib/stripe/webhook-handler";
import { PLANS } from "@/lib/stripe/plans";

const PRICE_ID_TO_TIER: Record<string, "pro" | "max"> = Object.fromEntries(
  (["pro", "max"] as const)
    .filter((tier) => PLANS[tier].stripePriceId)
    .map((tier) => [PLANS[tier].stripePriceId as string, tier]),
);

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  // Signature verification needs the exact raw bytes Stripe signed — must
  // read via request.text(), never request.json() (which would re-serialize
  // and change whitespace/key order, breaking the signature check).
  const rawBody = await request.text();

  let event;
  try {
    event = constructStripeEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[TutorAI] Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const update = resolveSubscriptionUpdate(event, PRICE_ID_TO_TIER);
  if (!update) {
    return NextResponse.json({ received: true });
  }

  const supabase = await createServiceRoleClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      stripe_subscription_id: update.stripeSubscriptionId,
      subscription_tier: update.subscriptionTier,
      subscription_status: update.subscriptionStatus,
    })
    .eq("stripe_customer_id", update.stripeCustomerId);

  if (error) {
    console.error("[TutorAI] failed to apply subscription update", error);
    return NextResponse.json({ error: "failed_to_apply_update" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
