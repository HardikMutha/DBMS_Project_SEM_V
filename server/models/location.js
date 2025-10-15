export const createLocation = async function (connection, { place, longitude, latitude }) {
  const [result] = await connection.query(`INSERT INTO Location (place, longitude, latitude) VALUES (?, ?, ?)`, [
    place,
    longitude,
    latitude,
  ]);
  return result;
};

export const deleteLocation = async function (connection, id) {
  const [rows] = await connection.query(`DELETE FROM Location WHERE id = ?`, id);
  return rows;
};

export const getLocationById = async function (connection, id) {
  const [rows] = await connection.query(`SELECT * FROM Location WHERE id =?`, id);
  return rows[0];
};
