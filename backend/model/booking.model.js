import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: 'User'},
    show: {type: String, required: true, ref: 'Show'},
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean, default: false},
    // store Stripe/session payment URL (string)
    paymentLink: { type: String },
    // store Stripe Checkout session id to help reconcile webhooks
    sessionId: { type: String },
},{timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;