import express from "express";
import authRouter from "./routes/auth.js";
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 5000; 

app.get("/", (req, res) => {
  res.send("Hello TweetX!");
});

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
