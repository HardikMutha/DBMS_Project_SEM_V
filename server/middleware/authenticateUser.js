import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/token.js";
import { getUserById } from "../models/user.js";

export const authenticateAdmin = (req, res, next) => {
  // will write tonight
};

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const { id } = verifyToken(token, process.env.JWT_SECRET);

    if (!id) {
      return res.status(401).json({ success: false, message: "Invalid Token Please Login Again" });
    }
    const foundUser = await getUserById(id);

    if (!foundUser) {
      return res.status(401).json({ success: false, message: "You are Not Authorized" });
    }
    req.user = foundUser;
    return next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    console.log(err);
    return res.status(500).json({ success: false, message: "An Error Occured" });
  }
};
