import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
    // send user in req obj
    req.user = user;
    next();
  } catch (error) {
    console.log("Protected Route", error);
    return res.status(500).json({ error: "Internal server Error" });
  }
};
