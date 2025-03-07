import express from "express";
import { protectedRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
} from "../controllers/user.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggested", protectedRoute, getSuggestedUsers);
router.patch("/follow/:id", protectedRoute, followUnfollowUser);
// router.post("/update", protectedRoute, getUserProfile);
export default router;
