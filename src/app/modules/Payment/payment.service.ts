import Stripe from "stripe";
import config from "../../config";
const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2025-05-28.basil",
});

const createPayment = async () => {
  try {
    const session = stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            unit_amount: 2000 * 100,
            product_data: {
              name: "Your Product Name",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: "ahmedmihad962@gmail.com",
      success_url: `${config.client_url}/success`,
      cancel_url: `${config.client_url}/cancel`,
    });
    return (await session).url
  } catch (error) {
    console.log(error);
  }
};

export const paymentServices = {
  createPayment,
};
