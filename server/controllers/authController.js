import { createUser, getUserByUsernameOrEmail } from "../models/user.js";
import { hashPassword, matchPassword } from "../utils/password.js";
import { createSecretToken } from "../utils/token.js";

export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const result = await createUser({ username, email, password: hashedPassword });
    const token = createSecretToken(result?.insertId, process.env.JWT_SECRET);
    res.status(201).json({ success: true, data: { userId: result?.insertId, username }, token });
  } catch (error) {
    console.error(error?.message);
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, error: "Username or email already exists" });
    }
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { username, email, password } = req?.body;
  if (!username && !email) {
    return res.status(400).json({ success: false, error: "Username or email is required" });
  }
  if (!password) {
    return res.status(400).json({ success: false, error: "Password is required" });
  }
  try {
    const user = await getUserByUsernameOrEmail(username || email);
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    const isPasswordValid = await matchPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    const token = createSecretToken(user.id, process.env.JWT_SECRET);
    res.status(200).json({ success: true, data: { userId: user.id, username: user.username }, token });
  } catch (error) {
    console.error(error?.message);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};
