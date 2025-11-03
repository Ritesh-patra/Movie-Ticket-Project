import { inngest } from "../inngest/index.js";
import Booking from "../model/booking.model.js";
import Show from "../model/show.model.js";
import Stripe from "stripe";

const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {};
    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.error("Error checking seat availability:", error);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    // Check seat availability
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({
        success: false,
        message:
          "One or more selected seats are already booked. Please choose different seats.",
      });
    }

    const showData = await Show.findById(showId).populate("movie");
    if (!showData) {
      return res.json({ success: false, message: "Show not found" });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    // Mark seats as occupied
    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");
    await showData.save();

    // Stripe payment
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: { name: showData.movie.title },
          unit_amount: Math.floor(booking.amount * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items,
      mode: "payment",
      metadata: { bookingId: booking._id.toString() },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
    });

  // store payment link and session id on booking to help webhook reconciliation
  booking.paymentLink = session.url;
  booking.sessionId = session.id;
  await booking.save();

    //run inngest sheduler function to check payment status after
     
    await inngest.send({
      name: 'app/checkpayment',
      data: {
        bookingId: booking._id.toString()
      }
    })

    return res.json({
      success: true,
      message: "Booking created successfully",
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.json({ success: false, message: "Internal Server Error" });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log("Error fetching occupied seats:", error);
    return res.json({ success: false, message: "Internal Server Error" });
  }
};
