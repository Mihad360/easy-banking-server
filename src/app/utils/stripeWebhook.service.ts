import Stripe from "stripe";
import { completeDeposit } from "./completePayments/completeDeposit";

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  // console.log(session)
  // Extract metadata you passed when creating the checkout session
  const { metadata } = session;

  if (metadata?.transactionType === "deposit") {
    await completeDeposit(metadata);
  } else if (metadata?.transactionType === "transfer") {
    // await completeTransfer(userId, accountId, session.amount_total);
  }
};
