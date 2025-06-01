import Stripe from "stripe";
import { Response, Request } from "express";
import config from "../config";
import { handleCheckoutSessionCompleted } from "./stripeWebhook.service";

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2025-05-28.basil",
});

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe_webhook_key as string,
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case "payment_intent.succeeded":
      //   await handlePaymentIntentSucceeded(event.data.object);
      break;
    case "charge.succeeded":
      //   await handleChargeSucceeded(event.data.object);
      break;
    // Add more cases as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};
