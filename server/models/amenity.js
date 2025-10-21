export const createAmenity = async function (connection, { name, isPaid, price }) {
  const [result] = await connection.query(`INSERT INTO Amenity VALUES (?, ?, ?)`, name, isPaid, price);
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

export const getPriceRangeAmenities = async function (connection, low, high) {
  const [rows] = await connection.query(`SELECT * FROM Amenity WHERE price >= ? AND price <= ?`, low, high);
  return rows;
};
