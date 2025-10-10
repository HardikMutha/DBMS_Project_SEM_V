import { createUser } from "../models/user.js";
import { hashPassword } from "../utils/password.js";

export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    await createUser({ username, email, password: hashedPassword });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
