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

export const getUserCount = async function (connection) {
  const [rows] = await connection.query(`SELECT COUNT(*) AS userCount FROM Users`);
  return rows[0].userCount;
};

export const getAllUsers = async function (connection) {
  const [rows] = await connection.query("SELECT id, username, email, role FROM Users ORDER BY id ASC");
  return rows;
};