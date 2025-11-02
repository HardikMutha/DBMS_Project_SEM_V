export const createBookingQuery = async (connection, { userId, campgroundId, checkInDate, checkOutDate, amount }) => {
  const [rows] = await connection.query(
    `INSERT INTO Booking (userId, campgroundId, checkInDate, checkOutDate, createdAt,amount) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, campgroundId, checkInDate, checkOutDate, new Date(), amount],
  );
  return rows;
};

export const getBookingCount = async (connection) => {
  const [rows] = await connection.query("SELECT COUNT(*) AS bookingCount FROM Booking");
  return rows[0].bookingCount;
};
