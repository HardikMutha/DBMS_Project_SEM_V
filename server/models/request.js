import pool from "../db/config.js";
export const createRequestQuery = async ({ requestedBy, campgroundId }) => {
  const [result] = await pool.query(`INSERT INTO Request (requestedBy,campgroundId) VALUES (?,?)`, [requestedBy, campgroundId]);
  return result;
};
