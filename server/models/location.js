import pool from "../db/config.js"

export const createLocation = async function ({ place, longitude, latitude }) {
  const [result] = await pool.query(`INSERT INTO Location (place, longitude, latitude) VALUES (?, ?, ?)`, [
    place,
    longitude,
    latitude,
  ]);
  return result;
};

export const getPlaceLocation = async function (place) {
  const [rows] = await pool.query(`SELECT * FROM Location WHERE place = ?`, place);
  return rows[0];
};

export const deleteLocation = async function (place) {
  const [rows] = await pool.query(`DELETE FROM Location WHERE place = ?`, place);
  return rows;
}
