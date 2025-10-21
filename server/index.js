import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import bodyParser from "body-parser";
import cors from "cors";
import campgroundRouter from "./routes/campground.js";
import requestRouter from "./routes/request.js";

dotenv.config({ quiet: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/campground", campgroundRouter);
app.use("/api/requests", requestRouter);

app.get("/api", (req, res) => res.send("API is running..."));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
