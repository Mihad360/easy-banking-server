import Stripe from "stripe";
import config from "../config";
const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2025-05-28.basil",
});

export const createPayment = async (
  amount: number,
  email: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metaData: any,
) => {
  try {
    const session = stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            unit_amount: amount * 100,
            product_data: {
              name: "Your Product Name",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${config.client_url}/success`,
      cancel_url: `${config.client_url}/cancel`,
      metadata: metaData,
    });
    return (await session).url;
  } catch (error) {
    console.log(error);
  }
};
