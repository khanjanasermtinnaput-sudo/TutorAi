import { test } from "node:test";
import assert from "node:assert/strict";

// getStripe() only reads this lazily on first call, so setting it here
// (before any test runs) is enough — no need to mock the module.
process.env.STRIPE_SECRET_KEY = "sk_test_dummy_key_for_offline_signing_tests";

import { getStripe } from "../lib/stripe/client";
import { constructStripeEvent, resolveSubscriptionUpdate } from "../lib/stripe/webhook-handler";

const WEBHOOK_SECRET = "whsec_test_secret";

function signPayload(payload: object): { body: string; signature: string } {
  const body = JSON.stringify(payload);
  const signature = getStripe().webhooks.generateTestHeaderString({ payload: body, secret: WEBHOOK_SECRET });
  return { body, signature };
}

test("constructStripeEvent: accepts a correctly signed payload", () => {
  const { body, signature } = signPayload({ id: "evt_test_1", object: "event", type: "ping" });
  const event = constructStripeEvent(body, signature, WEBHOOK_SECRET);
  assert.equal(event.id, "evt_test_1");
});

test("constructStripeEvent: rejects a payload signed with the wrong secret", () => {
  const body = JSON.stringify({ id: "evt_test_2", object: "event", type: "ping" });
  const wrongSignature = getStripe().webhooks.generateTestHeaderString({ payload: body, secret: "whsec_wrong" });
  assert.throws(() => constructStripeEvent(body, wrongSignature, WEBHOOK_SECRET));
});

test("constructStripeEvent: rejects a tampered body (signature no longer matches)", () => {
  const { body, signature } = signPayload({ id: "evt_test_3", object: "event", type: "ping" });
  const tamperedBody = body.replace("evt_test_3", "evt_test_HACKED");
  assert.throws(() => constructStripeEvent(tamperedBody, signature, WEBHOOK_SECRET));
});

test("resolveSubscriptionUpdate: checkout.session.completed activates the metadata tier", () => {
  const event = {
    type: "checkout.session.completed",
    data: { object: { customer: "cus_1", subscription: "sub_1", metadata: { tier: "pro" } } },
  } as never;
  const result = resolveSubscriptionUpdate(event, {});
  assert.deepEqual(result, {
    stripeCustomerId: "cus_1",
    stripeSubscriptionId: "sub_1",
    subscriptionTier: "pro",
    subscriptionStatus: "active",
  });
});

test("resolveSubscriptionUpdate: checkout.session.completed with no tier metadata is ignored", () => {
  const event = {
    type: "checkout.session.completed",
    data: { object: { customer: "cus_1", subscription: "sub_1", metadata: {} } },
  } as never;
  assert.equal(resolveSubscriptionUpdate(event, {}), null);
});

test("resolveSubscriptionUpdate: subscription.updated maps price id to tier and status", () => {
  const event = {
    type: "customer.subscription.updated",
    data: {
      object: {
        id: "sub_1",
        customer: "cus_1",
        status: "active",
        items: { data: [{ price: { id: "price_max" } }] },
      },
    },
  } as never;
  const result = resolveSubscriptionUpdate(event, { price_max: "max" });
  assert.deepEqual(result, {
    stripeCustomerId: "cus_1",
    stripeSubscriptionId: "sub_1",
    subscriptionTier: "max",
    subscriptionStatus: "active",
  });
});

test("resolveSubscriptionUpdate: subscription.updated with past_due status", () => {
  const event = {
    type: "customer.subscription.updated",
    data: {
      object: { id: "sub_1", customer: "cus_1", status: "past_due", items: { data: [{ price: { id: "price_pro" } }] } },
    },
  } as never;
  const result = resolveSubscriptionUpdate(event, { price_pro: "pro" });
  assert.equal(result?.subscriptionStatus, "past_due");
});

test("resolveSubscriptionUpdate: subscription.deleted downgrades to free/canceled", () => {
  const event = {
    type: "customer.subscription.deleted",
    data: {
      object: { id: "sub_1", customer: "cus_1", status: "canceled", items: { data: [{ price: { id: "price_max" } }] } },
    },
  } as never;
  const result = resolveSubscriptionUpdate(event, { price_max: "max" });
  assert.deepEqual(result, {
    stripeCustomerId: "cus_1",
    stripeSubscriptionId: "sub_1",
    subscriptionTier: "free",
    subscriptionStatus: "canceled",
  });
});

test("resolveSubscriptionUpdate: ignores event types this app doesn't act on", () => {
  const event = { type: "invoice.paid", data: { object: {} } } as never;
  assert.equal(resolveSubscriptionUpdate(event, {}), null);
});
