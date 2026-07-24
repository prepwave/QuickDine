import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import adminRoutes from "./routes/adminRautes.js";
import "./config/cloudinary.js";
const app = express();

// connect to MongoDB
await connectDB();
import { v2 as cloudinary } from "cloudinary";

try {
  const result = await cloudinary.api.ping();
  console.log("Cloudinary Ping:", result);
} catch (err) {
  console.error("Cloudinary Ping Error:", err);
}

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
    res.send("Server is Live!");
});

app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});