import { Router } from "express";
import {
  getRestaurants,
  getFeaturedRestaurants,
  getSlugsRestaurants,
  getRestaurantBookings,
  getRestaurantAvailability,
} from "../controllers/restaurantController.js";

const restaurantRouter = Router();

// Get all restaurants
restaurantRouter.get("/", getRestaurants);

// Get featured restaurants
restaurantRouter.get("/featured", getFeaturedRestaurants);

// Get bookings for a restaurant
restaurantRouter.get("/:restaurantId/bookings", getRestaurantBookings);

restaurantRouter.get(
  "/:restaurantId/availability",
  getRestaurantAvailability
);

// Get restaurant by slug
restaurantRouter.get("/:slug", getSlugsRestaurants);




export default restaurantRouter;