import { Router } from "express";
import {
  createBooking,
  getMyBooking,
  cancelBooking,
}  from "../controllers/bookingController.js";

import { protect } from "../middlewares/auth.js";

const bookingRouter = Router();

// Create a new booking
// POST /api/bookings
bookingRouter.post("/", protect, createBooking);

// Get logged-in user's bookings
// GET /api/bookings/my
bookingRouter.get("/my", protect, getMyBooking);

// Cancel a booking
// PUT /api/bookings/:id/cancel
bookingRouter.put("/:id/cancel", protect, cancelBooking);

export default bookingRouter;