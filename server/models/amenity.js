export const createAmenity = async function (connection, { name, isPaid, price }) {
  const [result] = await connection.query(`INSERT INTO Amenity (name, isPaid, price) VALUES (?, ?, ?)`, [name, isPaid, price]);
  return result;
};

export const getAllAmenities = async function (connection) {
  const [rows] = await connection.query(`SELECT * FROM AmenitY`);
  return rows;
};

export const getAmenityById = async function (connection, id) {
  const [rows] = await connection.query(`SELECT * FROM Amenity WHERE id = ?`, id);
  return rows[0];
};

export const getFreeAmenities = async function (connection) {
  const [rows] = await connection.query(`SELECT * FROM Amenity WHERE isPaid = FALSE`);
  return rows;
};

export const getPriceRangeAmenities = async function (connection, { low, high }) {
  const [rows] = await connection.query(`SELECT * FROM Amenity WHERE price >= ? AND price <= ?`, [low, high]);
  return rows;
};

export const getCampgroundAmenities = async function (connection, id) {
  const [rows] = await connection.query(
    `SELECT * FROM Amenity JOIN HasAmenity ON Amenity.id = HasAmenity.amenity_id WHERE HasAmenity.campgroundId = ?`,
    id,
  );
  return rows;
};

export const addCampgroundAmenity = async function (connection, { campgroundId, amenity_id }) {
  const [result] = await connection.query(`INSERT INTO HasAmenity (amenity_id, campgroundId) VALUES (?, ?)`, [
    amenity_id,
    campgroundId,
  ]);
  return result;
};

export const removeCampgroundAmenity = async function (connection, { campgroundId, amenity_id }) {
  const [result] = await connection.query(`DELETE FROM HasAmenity WHERE campgroundId = ? AND amenity_id = ?`, [
    campgroundId,
    amenity_id,
  ]);
  return result;
};
