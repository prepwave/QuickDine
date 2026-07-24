import { Router } from "express";
import {
  getOwnerRestaurant,
  createRestaurant,
  updateOwnerRestaurant,
  getOwnerBookings,
  updateBookingStatus,
} from "../controllers/ownerController.js";

import { ownerOnly, protect } from "../middlewares/auth.js";
import upload from "../config/multer.js";

const ownerRouter = Router();


ownerRouter.use(protect)
ownerRouter.use(ownerOnly)
// Get owner's restaurant
ownerRouter.get("/restaurant",  getOwnerRestaurant);

// Create restaurant
ownerRouter.post(
  "/restaurant",
  (req, res, next) => {
    console.log("POST /api/owner/restaurant HIT");
    next();
  },
  
  upload.single("image"),
  createRestaurant
);

// Update restaurant
ownerRouter.put(
  "/restaurant",
  
  upload.single("image"),
  updateOwnerRestaurant
);

// Get owner's bookings
ownerRouter.get("/bookings",  getOwnerBookings);

ownerRouter.put("/bookings/:id/status", updateBookingStatus);



export default ownerRouter;