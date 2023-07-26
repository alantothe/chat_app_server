import db from "./db/mongo.js";

import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import logger from "morgan";
import routes from "./routes/index.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(logger("dev"));

const PORT = process.env.PORT || 4000

app.use("/api", routes)

db.on("connected", () => {
    console.clear();
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Express server running on PORT: ${PORT}`);
    });
  });


