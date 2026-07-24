import { Router } from "express";
import { getMe, loginUser, registerUser } from "../controllers/authControllers.js";
import { protect } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/register", registerUser); // ✅ spelling corrected
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getMe);

export default authRouter;