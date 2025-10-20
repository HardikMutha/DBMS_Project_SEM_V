import { createUser, getUserByUsernameOrEmail } from "../models/user.js";
import { hashPassword, matchPassword } from "../utils/password.js";
import { createSecretToken } from "../utils/token.js";
import { getDBConnection } from "../db/config.js";

export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Username, email and password are required" });
  }
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    await connection.beginTransaction();
    const hashedPassword = await hashPassword(password);

    const result = await createUser(connection, { username, email, password: hashedPassword });

    // create the secret token with user id as the only field. Not added email coz user privacy is important
    const token = createSecretToken(result?.insertId, process.env.JWT_SECRET);

    await connection.commit();
    res.status(201).json({ success: true, data: { userId: result?.insertId, username }, token });
  } catch (err) {
    console.log(err?.message);
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "Username or email already exists" });
    }
    res.status(500).json({ message: err?.message || "Internal server error" });
  } finally {
    connection.release();
  }
};

export const loginUser = async (req, res) => {
  const { username, email, password } = req?.body;
  if (!username && !email) {
    return res.status(400).json({ success: false, message: "Username or email is required" });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: "Password is required" });
  }
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    await connection.beginTransaction();
    const user = await getUserByUsernameOrEmail(connection, username || email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await matchPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = createSecretToken(user.id, process.env.JWT_SECRET);
    connection.commit();
    res.status(200).json({ success: true, data: { userId: user.id, username: user.username, role: user?.role }, token });
  } catch (err) {
    console.log(err?.message);
    res.status(500).json({ message: err?.message || "Internal server error" });
  } finally {
    connection.release();
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    await connection.beginTransaction();
    const user = await getUserByUsernameOrEmail(connection, email);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await matchPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = createSecretToken(user.id, process.env.JWT_SECRET);
    await connection.commit();
    res.status(200).json({ success: true, data: { userId: user.id, username: user.username, role: user?.role }, token });
  } catch (err) {
    console.log(err?.message);
    res.status(500).json({ message: err?.message || "Internal server error" });
  } finally {
    connection.release();
  }
};

export const createAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    await connection.beginTransaction();
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Username, email and password are required" });
    }
    const hashedPassword = await hashPassword(password);
    const result = await createUser(connection, { username, email, password: hashedPassword, role: "admin" });
    await connection.commit();
    res.status(201).json({ success: true, data: { userId: result?.insertId, username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err?.message || "Internal server error" });
  } finally {
    connection.release();
  }
};
