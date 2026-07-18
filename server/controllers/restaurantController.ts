import { Request, Response } from "express";
import Restaurant from "../models/Restaurants.js";
import Booking from "../models/Booking.js";

// ======================================================
// Get all restaurants
// GET /api/restaurants
// ======================================================
export const getRestaurants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      cuisine,
      priceRange,
      featured,
      page = "1",
      limit = "10",
    } = req.query;

    const query: any = {
      status: "approved",
    };

    if (search) {
      if (typeof search !== "string" || search.length > 100) {
        res.status(400).json({ success: false, message: "Invalid search query" });
        return;
      }
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    if (cuisine) {
      query.cuisine = cuisine;
    }

    if (priceRange) {
      query.priceRange = priceRange;
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const restaurants = await Restaurant.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Restaurant.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      restaurants,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Get Featured Restaurants
// GET /api/restaurants/featured
// ======================================================
export const getFeaturedRestaurants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurants = await Restaurant.find({
      status: "approved",
      featured: true,
      exclusive: true,
    })
      .sort({ rating: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Get Restaurant By Slug
// GET /api/restaurants/:slug
// ======================================================
export const getSlugsRestaurants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const restaurant = await Restaurant.findOne({
      slug,
      status: "approved",
    }).populate("owner", "name email");

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Get Active Bookings for Restaurant on Selected Date
// GET /api/restaurants/:restaurantId/bookings?date=2026-07-18
// ======================================================
export const getRestaurantBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const { date } = req.query;

    if (!date) {
      res.status(400).json({
        success: false,
        message: "Date is required.",
      });
      return;
    }

    const selectedDate = new Date(date as string);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      restaurant: restaurantId,
      bookingDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["pending", "confirmed"],
      },
    })
      .populate("user", "name email")
      .sort({ timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};