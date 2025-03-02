import express from "express";

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Server is Runnning.");
});

app.listen(8000, () => {
  console.log("Server is running on ", port);
});
