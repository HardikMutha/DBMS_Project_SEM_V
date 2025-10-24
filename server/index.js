import express from "express";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import authRoutes from "./routes/auth.js";
import bodyParser from "body-parser";
import cors from "cors";
import campgroundRouter from "./routes/campground.js";
import requestRouter from "./routes/request.js";
import reviewRouter from "./routes/review.js";
import bookingRouter from "./routes/booking.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/campground", campgroundRouter);
app.use("/api/requests", requestRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);

app.get("/api", (req, res) => res.send("API is running..."));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
