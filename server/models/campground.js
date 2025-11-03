export const createCampgroundQuery = async function (connection, { title, description, capacity, type, locId, ownerId, price }) {
  const [result] = await connection.query(
    `INSERT INTO Campground (title, description, capacity, type, locId, ownerId, price,isApproved ) VALUES (?,?,?,?,?,?,?,?)`,
    [title, description, capacity, type, locId, ownerId, price, false],
  );
  return result;
};

export const getCampgroundByIdQuery = async function (connection, { campgroundId }) {
  const [rows] = await connection.query(`SELECT * FROM Campground WHERE id = ?`, [campgroundId]);
  return rows[0];
};

export const addToFavouritesQuery = async function (connection, { userId, campgroundId }) {
  const [result] = await connection.query(`INSERT INTO HasFavourite (userId, campgroundId) VALUES (?, ?)`, [
    userId,
    campgroundId,
  ]);
  return result;
};

export const removeFromFavouritesQuery = async function (connection, { userId, campgroundId }) {
  const [result] = await connection.query(`DELETE FROM HasFavourite WHERE userId = ? AND campgroundId = ?`, [
    userId,
    campgroundId,
  ]);
  return result;
};

export const getUserFavouritesQuery = async function (connection, id) {
  const [rows] = await connection.query(`SELECT * FROM HasFavourite WHERE userId = ?`, id);
  return rows;
};

export const getOwnerInfoQuery = async function (connection, { campgroundId }) {
  const [rows] = await connection.query(
    `SELECT u.username,u.email FROM Users AS u LEFT JOIN Campground AS cg ON u.id = ${campgroundId}`,
  );
  return rows[0];
};

export const getAllApprovedCampgroundsQuery = async function (connection) {
  const [rows] = await connection.query(
    `SELECT c.*, l.place, l.latitude, l.longitude, 
     (SELECT imgUrl FROM Images WHERE campgroundId = c.id LIMIT 1) as imageUrl
     FROM Campground c 
     LEFT JOIN Location l ON c.locId = l.id 
     WHERE c.isApproved = true 
     ORDER BY c.id DESC`,
  );
  return rows;
};

export const getCampgroundCount = async function (connection) {
  const [rows] = await connection.query("SELECT COUNT(*) AS campgroundCount FROM Campground WHERE isApproved = 1");
  return rows[0].campgroundCount;
};

export const getPendingCampgroundRequests = async function (connection) {
  const [rows] = await connection.query("SELECT u.username, cg.title FROM Users u JOIN Campground cg ON u.id = cg.ownerId JOIN Request r ON cg.id = r.campgroundId WHERE r.status = 'pending' ORDER BY r.id DESC");
  return rows;
};

export const getAllCampgrounds = async function(connection) {
  const [rows] = await connection.query("SELECT * FROM Campground");
  return rows;
};

export const getCampgroundRequestById = async function(connection, campgroundId) {
  const [rows] = await connection.query(`SELECT * FROM Request WHERE campgroundId = ?`, [campgroundId]);
  return rows;
};