export const createRequestQuery = async (connection, { requestedBy, campgroundId }) => {
  const [result] = await connection.query(`INSERT INTO Request (requestedBy,campgroundId) VALUES (?,?)`, [
    requestedBy,
    campgroundId,
  ]);
  return result;
};
