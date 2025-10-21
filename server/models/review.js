export const createReview = async function (connection, { userId, campgroundId, content, rating }) {
  const [result] = await connection.query(`INSERT INTO Review (userId, campgroundId, content, rating) VALUES (?,?,?,?)`, [
    userId,
    campgroundId,
    content,
    rating,
  ]);
  return result;
};

export const getCampgroundReviews = async function (connection, id) {
  const [rows] = await connection.query(`SELECT * FROM Review WHERE campgroundId = ?`, id);
  return rows;
};

export const getUserReviews = async function (connection, id) {
  const [rows] = await connection.query(`SELECT * FROM Review WHERE userId = ?`, id);
  return rows;
};

export const getCampgroundAverageRating = async function (connection, id) {
  const [rows] = await connection.query(`SELECT AVG(rating) FROM Review WHERE campgroundId = ? GROUP BY campgroundId `, id);
  return rows;
};
