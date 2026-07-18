
import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import Restaurant from "../models/Restaurants.js";

// ======================================================
// Create a new booking
// POST /api/bookings
// @access Private
// ======================================================
export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      restaurant,
      bookingDate,
      timeSlot,
      guests,
      specialRequest,
    } = req.body;

    // User comes from auth middleware
    const user = (req as any).user?.id;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // Check restaurant exists
    const restaurantExists = await Restaurant.findById(restaurant);

    if (!restaurantExists) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    // Check duplicate booking
    const existingBooking = await Booking.findOne({
      user,
      restaurant,
      bookingDate: new Date(bookingDate),
      timeSlot,
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    if (existingBooking) {
      res.status(400).json({
        success: false,
        message: "You already have a booking for this time slot.",
      });
      return;
    }

    const booking = await Booking.create({
      user,
      restaurant,
      bookingDate,
      timeSlot,
      guests,
      specialRequest,
      status: "pending",
    });

    await booking.populate("restaurant", "name image location");

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  // code
};

export const cancelBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  // code
};