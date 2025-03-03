import { generateTokenAndsetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

// ----------- Sign Up--------------

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const exisingUser = await User.findOne({ username });
    if (exisingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ error: "Email is already taken." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password should atleast 6 charactres long" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndsetCookie(newUser._id, res);
      await newUser.save();
    }
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
  } catch (error) {
    console.log("Signup Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// -------------- Login user -----------------
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username & password!" });
    }
    generateTokenAndsetCookie(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Signup Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully!" });
  } catch (error) {
    console.log("Logout Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("GetMe Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
