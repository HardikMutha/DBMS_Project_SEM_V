export const createLocationQuery = async function (connection, { place, longitude, latitude }) {
  const [result] = await connection.query(`INSERT INTO Location (place, longitude, latitude) VALUES (?, ?, ?)`, [
    place,
    longitude,
    latitude,
  ]);
  return result;
};

export const deleteLocationQuery = async function (connection, id) {
  const [rows] = await connection.query(`DELETE FROM Location WHERE id = ?`, id);
  return rows;
};

export const getLocationById = async function (connection, id) {
  const [rows] = await connection.query(`SELECT * FROM Location WHERE id =?`, id);
  return rows[0];
};

export const updateLocationQuery = async function (connection, { locationId, place }) {
  const [result] = await connection.query(`UPDATE Location SET place = ? WHERE id = ?`, [place, locationId]);
  return result;
};
