export const createRequestQuery = async (connection, { requestedBy, campgroundId }) => {
  const [result] = await connection.query(`INSERT INTO Request (requestedBy,campgroundId) VALUES (?,?)`, [
    requestedBy,
    campgroundId,
  ]);
  return result;
};

export const getAllRequestsQuery = async (connection) => {
  const [rows] = await connection.query(`SELECT * FROM Request`);
  return rows;
};

export const approveRequestQuery = async (connection, { requestId }) => {
  const [rows] = await connection.query(`SELECT * FROM Request WHERE id = ?`, [requestId]);
  if (rows.length === 0) {
    throw new Error("Request not found");
  }
  await connection.query(`UPDATE Request SET status = 'approved' WHERE id = ?`, [requestId]);
  const [updatedRequestRows] = await connection.query(`SELECT * FROM Request WHERE id = ?`, [requestId]);

  const campgroundId = updatedRequestRows[0].campgroundId;

  await connection.query(`UPDATE Campground SET isApproved = TRUE WHERE id = ?`, [campgroundId]);
  const [updatedCampgroundRows] = await connection.query(`SELECT * FROM Campground WHERE id = ?`, [campgroundId]);

  return {
    updatedCampground: updatedCampgroundRows[0],
    updatedRequest: updatedRequestRows[0],
  };
};

export const rejectRequestQuery = async (connection, { requestId }) => {
  const [rows] = await connection.query(`SELECT * FROM Request WHERE id = ?`, [requestId]);
  if (rows.length === 0) {
    throw new Error("Request not found");
  }
  await connection.query(`UPDATE Request SET status='rejected' WHERE id = ?`, [requestId]);
  const [updatedRequestRows] = await connection.query(`SELECT * FROM Request WHERE id = ?`, [requestId]);
  const campgroundId = updatedRequestRows[0].campgroundId;
  await connection.query(`UPDATE Campground SET isApproved = FALSE WHERE id = ?`, [campgroundId]);
  const [updatedCampgroundRows] = await connection.query(`SELECT * FROM Campground WHERE id = ?`, [campgroundId]);

  return {
    updatedCampground: updatedCampgroundRows[0],
    updatedRequest: updatedRequestRows[0],
  };
};
