import { Router } from "express";
import { aproveRestaurant, getAllRestaurant, getAllRestaurants } from "../controllers/adminController.js";



const adminRoutes = Router();

adminRoutes.get("/restaurants", getAllRestaurants);
adminRoutes.put("/restaurants/:id/approve", aproveRestaurant);
adminRoutes.get("/stats", getAllRestaurant);

export default adminRoutes;
