import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import "dotenv/config";
import connectMongoDB from "./db/connectDB.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
// console.log("test", process.env)
// configure clodinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TweetX!");
});

console.log(process.env.MONGO_URI);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectMongoDB();
});
