export const createCampgroundQuery = async function (connection, { title, description, capacity, type, locId, ownerId, price }) {
  const [result] = await connection.query(
    `INSERT INTO Campground (title, description, capacity, type, locId, ownerId, price,isApproved ) VALUES (?,?,?,?,?,?,?,?)`,
    [title, description, capacity, type, locId, ownerId, price, false]
  );
  return result;
};

export const getCampgroundByIdQuery = async function (connection, campgroundId) {
  const [rows] = await connection.query(`SELECT * FROM Campground WHERE id = ?`, [campgroundId]);
  return rows[0];
};
