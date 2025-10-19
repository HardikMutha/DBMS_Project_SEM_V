import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/token.js";
import { getUserById } from "../models/user.js";
import { getDBConnection } from "../db/config.js";

export const verifyAdminSignup = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    if (token !== process.env.SUPER_ADMIN_TOKEN) {
      return res.status(403).json({ success: false, message: "Invalid Credentials" });
    }
    return next();
  } catch (error) {
    console.error(error?.message);
    return res.status(500).json({ success: false, message: "An Error Occured" });
  }
};

// This middleware will only be used when approval of campground and request is needed
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const { id } = verifyToken(token, process.env.JWT_SECRET);

    if (!id) {
      return res.status(401).json({ success: false, message: "Invalid Token Please Login Again" });
    }
    const connection = await getDBConnection();

    const foundUser = await getUserById(connection, id);

    if (!foundUser || foundUser?.role !== "admin") {
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
    const connection = await getDBConnection();
    const foundUser = await getUserById(connection, id);

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
