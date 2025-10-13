import pool from "../db/config.js";
export const createCampgroundQuery = async function ({ title, description, capacity, type, locId, ownerId, price }) {
  const [result] = await pool.query(
    `INSERT INTO Campground (title, description, capacity, type, locId, ownerId, price,isApproved ) VALUES (?,?,?,?,?,?,?,?)`,
    [title, description, capacity, type, locId, ownerId, price, false]
  );
  return result;
};
