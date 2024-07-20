import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";
import { SimpleLinearRegression } from "ml-regression";
const app = express();

let diamonds = [];
const loadCSVData = () => {
  fs.createReadStream(path.resolve("train.csv"))
    .pipe(csvParser())
    .on("data", (data) => diamonds.push(data))
    .on("end", () => {
      console.log("CSV data loaded");
      trainModel();
    });
};

loadCSVData();

// Prediction function
let regression;

const trainModel = () => {
  const carat = diamonds.map((d) => parseFloat(d.carat));
  const price = diamonds.map((d) => parseFloat(d.price));
  regression = new SimpleLinearRegression(carat, price);
};

export const predict = (diamondAttributes) => {
  if (!regression) {
    throw new Error("Model has not been trained yet");
  }
  const carat = parseFloat(diamondAttributes.carat);
  return regression.predict(carat);
};

// Prediction route
app.post("/predict", (req, res) => {
  try {
    const diamondAttributes = req.body; // Expecting JSON input with diamond attributes
    const predictedPrice = predict(diamondAttributes);
    res.json({ predictedPrice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
