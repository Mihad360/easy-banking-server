import Stripe from "stripe";
import { completeDeposit } from "./completePayments/completeDeposit";
import { completeDepostiLoan } from "./completePayments/completeDepostiLoan";

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const { metadata } = session;
// console.log(metadata)
  if (metadata?.transactionType === "deposit") {
    const result = await completeDeposit(metadata);
    console.log(result);
  } else if (metadata?.transactionType === "deposit-loan") {
    const result = await completeDepostiLoan(metadata);
    console.log(result);
  }
};
