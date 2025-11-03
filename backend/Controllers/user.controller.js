import { clerkClient } from "@clerk/express";
import Booking from "../model/booking.model.js";
import Movie from "../model/movie.model.js";

export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth.userId;
    const bookings = await Booking.find({ user })
      .populate({ path: "show", populate: { path: "movie" } })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth.userId;

    const user = await clerkClient.users.getUser(userId);
    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }

    let message;
    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
      message = "Favorite added successfully";
    } else {
      user.privateMetadata.favorites = user.privateMetadata.favorites.filter(
        (id) => id !== movieId
      );
      message = "Favorite removed successfully";
    }

    await clerkClient.users.updateUser(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({ success: true, message });
  } catch (error) {
    console.error("Error updating favorite:", error);
    res.json({ success: false, message: "Failed to update favorite" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth.userId);
    const favorites = user.privateMetadata.favorites || [];
    const movies = await Movie.find({ _id: { $in: favorites } });
    res.json({ success: true, movies });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.json({ success: false, message: "Failed to fetch favorites" });
  }
};
