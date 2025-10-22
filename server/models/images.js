export const addImagesQuery = async (connection, imageUrl, campgroundId) => {
  const [rows] = await connection.query(`INSERT INTO Images (imgUrl,campgroundId) VALUES (?,?)`, [imageUrl, campgroundId]);
  return rows;
};

const updateImages = async () => {};
