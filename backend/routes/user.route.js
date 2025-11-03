import express from "express";
import { getFavorites, getUserBookings, updateFavorite } from "../Controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings)
userRouter.post('/update', updateFavorite)
userRouter.get('/favorites', getFavorites)

export default userRouter