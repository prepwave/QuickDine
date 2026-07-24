import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { User, IUser } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: HydratedDocument<IUser>;
  file?: Express.Multer.File;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("\n========== PROTECT MIDDLEWARE ==========");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);

  try {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Bearer Token");

      res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ User not found");

      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    console.log("✅ User Found");
    console.log("ID:", user._id);
    console.log("Email:", user.email);
    console.log("Role:", user.role);

    req.user = user;

    next();
  } catch (error: any) {
    console.log("❌ JWT ERROR");
    console.error(error);

    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log("\n========== ADMIN ONLY ==========");
  console.log("Role:", req.user?.role);

  if (req.user?.role === "admin") {
    console.log("✅ Admin Authorized");
    next();
    return;
  }

  console.log("❌ Access Denied");

  res.status(403).json({
    success: false,
    message: "Access denied. Admin only.",
  });
};

export const ownerOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log("\n========== OWNER ONLY ==========");
  console.log("Role:", req.user?.role);

  if (req.user?.role === "owner" || req.user?.role === "admin") {
    console.log("✅ Owner Authorized");
    next();
    return;
  }

  console.log("❌ Access Denied");

  res.status(403).json({
    success: false,
    message: "Access denied. Owner only.",
  });
};