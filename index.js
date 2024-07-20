import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import relationRoute from "./routes/userRelationRoute.js";
import { predict } from "./check.js";
dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5000; // Use PORT environment variable or default to 5000
const DATABASE_URL = process.env.DATABASE_URL;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to blog/post api");
});
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/connect", relationRoute);
app.post("/predict", (req, res) => {
  try {
    const diamondAttributes = req.body; // Expecting JSON input with diamond attributes
    const predictedPrice = predict(diamondAttributes);
    res.json({ predictedPrice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect(DATABASE_URL).then(() => {
  app.listen(PORT, () => {
    console.log("listening on port", PORT);
  });
});
