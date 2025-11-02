export const addImagesQuery = async (connection, { imageUrl, campgroundId }) => {
  const [rows] = await connection.query(`INSERT INTO Images (imgUrl,campgroundId) VALUES (?,?)`, [imageUrl, campgroundId]);
  return rows;
};

export const getImagesByCampgroundQuery = async (connection, { campgroundId }) => {
  const [rows] = await connection.query(`SELECT * FROM Images WHERE campgroundId = ?`, [campgroundId]);
  return rows;
};
