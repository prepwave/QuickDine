import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/restaurant.routes.js";
import bookingRouter from "./routes/booking.routes.js";

const app = express();

console.log("Mongo URI:", process.env.MONGODB_URI);

await connectDB();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
    res.send("Server is Live!");
});

app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/bookings", bookingRouter);
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