import pool from "../db/config.js"

export const createLocation = async function ({ place, longitude, latitude }) {
  const [result] = await pool.query(`INSERT INTO Location (place, longitude, latitude) VALUES (?, ?, ?)`, [
    place,
    longitude,
    latitude,
  ]);
  return result;
};

export const deleteLocation = async function (id) {
  const [rows] = await pool.query(`DELETE FROM Location WHERE id = ?`, id);
  return rows;
}

export const getLocationById = async function (id) {
  const [rows] = await pool.query(`SELECT * FROM Location WHERE id =?`, id);
  return rows[0];
}
