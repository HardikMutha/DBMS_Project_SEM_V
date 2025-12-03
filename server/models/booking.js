export const createBookingQuery = async (connection, { userId, campgroundId, checkInDate, checkOutDate, amount, guestCount }) => {
  const [rows] = await connection.query(
    `INSERT INTO Booking (userId, campgroundId, checkInDate, checkOutDate, createdAt, amount, guestCount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, campgroundId, checkInDate, checkOutDate, new Date(), amount, guestCount]
  );
  return rows;
};

export const getBookingCount = async (connection) => {
  const [rows] = await connection.query("SELECT COUNT(*) AS bookingCount FROM Booking");
  return rows[0].bookingCount;
};

export const getBookingsByCampgroundQuery = async (connection, { campgroundId }) => {
  const [rows] = await connection.query(
    `SELECT b.bookingId, b.userId, u.username, u.email, b.checkInDate, b.checkOutDate, b.createdAt, b.amount
     FROM Booking b
     JOIN Users u ON u.id = b.userId
     WHERE b.campgroundId = ?
     ORDER BY b.checkInDate ASC`,
    [campgroundId]
  );
  return rows;
};

export const getBookingsByUserIdQuery = async (connection, { userId }) => {
  const [rows] = await connection.query("SELECT * FROM Booking WHERE userId = ?", [userId]);
  return rows;
};

export const getBookingsByUserIdCampgroundIdQuery = async (connection, { userId, campgroundId }) => {
  const [rows] = await connection.query("SELECT * FROM Booking WHERE userId = ? AND campgroundId = ? ORDER BY checkOutDate ASC", [
    userId,
    campgroundId,
  ]);
  return rows;
};
