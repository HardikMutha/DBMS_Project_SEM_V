import pool from "../db/config.js";

export const createUser = async function ({ username, email, password }) {
  const [result] = await pool.query(`INSERT INTO Users (username, email, role, password) VALUES (?, ?, 'user', ?)`, [
    username,
    email,
    password,
  ]);
  return result;
};

export const getUserByUsernameOrEmail = async function (identifier) {
  const [rows] = await pool.query(`SELECT * FROM Users WHERE username = ? OR email = ?`, [identifier, identifier]);
  return rows[0];
};

export const getUserById = async function (id) {
  const [rows] = await pool.query(`SELECT * FROM Users WHERE id = ?`, [id]);
  return rows[0];
};
