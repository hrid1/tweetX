import express from "express";
import { protectedRoute } from "../middleware/protectRoute.js";
import { followUnfollowUser, getUserProfile } from "../controllers/user.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
// router.get("/suggested", protectedRoute, getUserProfile);
router.patch("/follow/:id", protectedRoute, followUnfollowUser);
// router.post("/update", protectedRoute, getUserProfile);
export default router