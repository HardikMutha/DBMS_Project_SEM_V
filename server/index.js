import express from "express";
import pool from "./db/db.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const app = express();

app.listen(3000, () => {
  console.log("listen on port 3000");
});

app.get("/", async (req, res) => {
  try {
    console.log(pool);
    const [rows, fields] = await pool.query("SELECT * FROM Users");
    return res.status(200).json({ rows, fields });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false });
  }
});
