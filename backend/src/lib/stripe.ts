import Stripe from "stripe";

function createStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(apiKey);
}

let stripeClient: Stripe | undefined;

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, property, receiver) {
    if (!stripeClient) {
      stripeClient = createStripeClient();
    }
    const value = Reflect.get(stripeClient, property, receiver);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(stripeClient)
      : value;
  },
});
