import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { User, IUser } from "../models/User.js";





export interface AuthRequest extends Request {
  user?: HydratedDocument<IUser>;
  file?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
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
  next: NextFunction,
): void => {
  if (req.user?.role === "admin") {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: "Access denied. Admin only.",
  });
};

export const ownerOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user && (req.user.role === "owner" || req.user.role === "admin")) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: "Access denied. Owner only.",
  });
};
