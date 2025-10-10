import pool from "../db/config.js";

export const createUser = async function ({ username, email, password }) {
  const [result] = await pool.query(
    `INSERT INTO Users (username, email, role, password) VALUES (?, ?, 'user', ?)`,
    [username, email, password]
  );
  console.log(result);
};
