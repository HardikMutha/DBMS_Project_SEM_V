import express from "express";
import pool from "./db.js";

const app = express();

app.listen(3000, () => {
  console.log("listen on port 3000");
});

app.get("/", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT `field` FROM `table`");
    return res.status(200).json({ rows, fields });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false });
  }
});
