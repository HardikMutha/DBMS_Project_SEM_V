import jwt from "jsonwebtoken";

export const createSecretToken = function (id, JWT_SECRET) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

export const verifyToken = (token, JWT_SECRET) => {
  return jwt.verify(token, JWT_SECRET);
};
