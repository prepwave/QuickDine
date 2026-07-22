import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import Restaurant from "../models/Restaurants.js";
import { User } from "../models/User.js";
import { getDefaultResultOrder } from "node:dns";
import Booking from "../models/Booking.js";

//  Get all restaurant for admin management  
// Get  /api/admin/restaurants



export const getAllRestaurants = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const restaurants = await Restaurant.find({}).populate('owner', 'name email phone').sort({createdAt: -1});
        res.json(restaurants);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}
// approve/reject restaurant profile
// PUT /api/admin/restaurants/:id/approve
export const aproveRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        if(!status || !["approved", "rejected", "pending"].includes(status)) {
            res.status(400).json({message: "Invalid status"});
            return;
        }
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if(!restaurant) {
            res.status(404).json({message: "Restaurant not found"});
            return;
        }
        res.json(restaurant);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}

// Get system statistics 
// PUT /api/admin/stats

export const getAllRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRestaurants = await Restaurant.countDocuments();
        const totalOwners = await User.countDocuments({ role: "owner" });
        const totalBookings = await Booking.countDocuments();

        // Get latest 10 bookings 
        const latestBookings = await Booking.find().populate("user", "name email").populate("restaurant", "name").sort({ createdAt: -1 }).limit(10);

        res.json({ totalUsers, totalRestaurants, totalOwners, totalBookings });
    } catch (error: any) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}