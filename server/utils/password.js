import bcrypt from "bcryptjs";
const saltRounds = 10;

export const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    if (!hash) return;
    return hash;
  } catch (err) {
    console.log(err);
    return;
  }
};
export const matchPassword = async (password, hashed_password) => {
  try {
    const result = await bcrypt.compare(password, hashed_password);
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};
