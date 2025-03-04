import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js"
import "dotenv/config";
import connectMongoDB from "./db/connectDB.js";

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
app.use("/api/user", userRouter)

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectMongoDB();
});