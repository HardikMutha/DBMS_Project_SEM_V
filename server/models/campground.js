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

export const addToFavourites = async function (connection, { userId, campgroundId }) {
  const [result] = await connection.query(`INSERT INTO HasFavourite (userId, campgroundId) VALUES (?, ?)`, [
    userId,
    campgroundId,
  ]);
  return result;
};

export const removeFromFavourites = async function (connection, { userId, campgroundId }) {
  const [result] = await connection.query(`DELETE FROM HasFavourite WHERE userId = ? AND campgroundId = ?`, [
    userId,
    campgroundId,
  ]);
  return result;
};

export const getUserFavourites = async function (connection, id) {
  const [rows] = await connection.query(`SELECT * FROM HasFavourite WHERE userId = ?`, id);
  return rows;
};
