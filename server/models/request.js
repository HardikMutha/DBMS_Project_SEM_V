export const createRequestQuery = async (connection, { requestedBy, campgroundId }) => {
  const [result] = await connection.query(`INSERT INTO Request (requestedBy,campgroundId) VALUES (?,?)`, [
    requestedBy,
    campgroundId,
  ]);
  return result;
};

export const getAllRequestsQuery = async (connection) => {
  const [rows] = await connection.query(`
    SELECT 
      temp2.requestId as id, 
      temp2.campgroundId,
      temp2.status, 
      place, longitude, latitude, 
      username, email, 
      title, description, capacity, type, price 
    FROM Location as loc 
    RIGHT JOIN (
      SELECT * FROM Users as u 
      RIGHT JOIN (
        SELECT 
          req.id as requestId, 
          req.campgroundId,
          req.status, 
          title, description, capacity, type, locId, ownerId, isApproved, price, requestedBy 
        FROM Request as req
        LEFT JOIN Campground as cg ON cg.id = req.campgroundId
      ) as temp ON temp.requestedBy = u.id
    ) as temp2 ON loc.id = temp2.locId
  `);

  // Fetch images for each request's campground
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].campgroundId) {
      const [images] = await connection.query(`SELECT id, imgUrl FROM Images WHERE campgroundId = ?`, [rows[i].campgroundId]);
      rows[i].images = images;
    } else {
      rows[i].images = [];
    }
  }

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
