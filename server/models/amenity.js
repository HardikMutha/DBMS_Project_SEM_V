import pool from "../db/config.js";

export const createAmenity = async function ({ name, isPaid, price }) {
  const [result] = pool.query(`INSERT INTO Amenity VALUES (?, ?, ?)`, name, isPaid, price);
  return result;
};

export const getAllAmenities = async function () {
  const [rows] = pool.query(`SELECT * FROM AmenitY`);
  return rows;
};

export const getAmenityById = async function (id) {
  const [rows] = pool.query(`SELECT * FROM Amenity WHERE id = ?`, id);
  return rows[0];
};

export const getFreeAmenities = async function () {
  const [rows] = pool.query(`SELECT * FROM Amenity WHERE isPaid = FALSE`);
  return rows;
};

export const getPriceRangeAmenities = async function (low, high) {
  const [rows] = pool.query(`SELECT * FROM Amenity WHERE price >= ? AND price <= ?`, low, high);
  return rows;
};
