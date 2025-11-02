export const createReviewQuery = async function (connection, { userId, campgroundId, content, rating }) {
  // first check if user had ever booked that campground.
  // If yes then only allow review creation.
  const [response] = await connection.query(
    `SELECT * FROM Users AS u RIGHT JOIN Booking AS b on u.id = b.userId WHERE u.id = ?`,
    [userId]
  );
  if (!response || !response.length) {
    throw new Error("You need to have an existing booking to add a review");
  }
  const [result] = await connection.query(`INSERT INTO Review (userId, campgroundId, content, rating) VALUES (?,?,?,?)`, [
    userId,
    campgroundId,
    content,
    rating,
  ]);
  return result;
};

export const getCampgroundReviewsQuery = async function (connection, { campgroundId }) {
  const [rows] = await connection.query(`SELECT * FROM Review WHERE campgroundId = ?`, [campgroundId]);
  return rows;
};

export const getUserReviewsQuery = async function (connection, { userId }) {
  const [rows] = await connection.query(`SELECT * FROM Review WHERE userId = ?`, [userId]);
  return rows;
};

export const getCampgroundAverageRatingQuery = async function (connection, { campgroundId }) {
  const [rows] = await connection.query(`SELECT AVG(rating) FROM Review WHERE campgroundId = ? GROUP BY campgroundId `, [
    campgroundId,
  ]);
  return rows;
};
