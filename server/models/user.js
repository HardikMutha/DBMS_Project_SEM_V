import pool from "../db/config.js";

export const createUser = async function (connection, { username, email, password, role = "user" }) {
  const [result] = await connection.query(`INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)`, [
    username,
    email,
    password,
    role,
  ]);
  return result;
};

export const getUserByUsernameOrEmail = async function (connection, identifier) {
  const [rows] = await connection.query(`SELECT * FROM Users WHERE username = ? OR email = ?`, [identifier, identifier]);
  return rows[0];
};

export const getUserById = async function (connection, id) {
  const [rows] = await connection.query(`SELECT * FROM Users WHERE id = ?`, [id]);
  return rows[0];
};
