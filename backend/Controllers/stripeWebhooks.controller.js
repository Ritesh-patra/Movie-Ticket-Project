import stripe from "stripe";
import Booking from "../model/booking.model.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhooks = async (req, res) => {
    console.log("Webhook received:", req.body); // add this
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`webhook Error: ${error.message}`);
  }

  console.log("Stripe event type:", event.type);
  console.log("Event data:", event.data.object);

  try {
    switch (event.type) {
      // Checkout Session completed (recommended for Checkout)
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("checkout.session.completed received", session.id);

        let bookingId = session?.metadata?.bookingId;
        if (!bookingId) {
          console.warn("No bookingId found on session metadata, trying sessionId lookup", session.id);
          // fallback: find booking by stored sessionId
          const bookingBySession = await Booking.findOne({ sessionId: session.id });
          if (bookingBySession) bookingId = bookingBySession._id;
        }

        if (!bookingId) {
          console.warn("Unable to resolve booking for session", session.id);
          break;
        }

        await Booking.findByIdAndUpdate(
          bookingId,
          { isPaid: true, paymentLink: "" },
          { new: true }
        );
        break;
      }

      // PaymentIntent succeeded (backup if you rely on payment intents)
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("payment_intent.succeeded received", paymentIntent.id);

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        const session = sessionList.data && sessionList.data[0];
        if (!session) {
          console.warn("No checkout session found for payment_intent", paymentIntent.id);
          break;
        }

        let bookingId = session?.metadata?.bookingId;
        if (!bookingId) {
          console.warn("No bookingId found on session metadata for payment_intent, trying sessionId lookup", paymentIntent.id);
          const bookingBySession = await Booking.findOne({ sessionId: session.id });
          if (bookingBySession) bookingId = bookingBySession._id;
        }

        if (!bookingId) {
          console.warn("Unable to resolve booking for payment_intent", paymentIntent.id);
          break;
        }

        await Booking.findByIdAndUpdate(
          bookingId,
          { isPaid: true, paymentLink: "" },
          { new: true }
        );
         //send  Confirmation the email
        await inngest.send({
          name: 'app/show.booked',
          data: {bookingId}
        })
        break;
      }

      default:
        console.log("unhandled event type: ", event.type);
    }
    res.json({ received: true });
  } catch (error) {
    console.error("webhooks processing error:", error);
    res.status(500).send("Internal Server Error");
  }
};
