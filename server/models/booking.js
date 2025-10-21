export const createBookingQuery = async (connection, { userId, campgroundId, checkInDate, checkOutDate, amount }) => {
  const [rows] = await connection.query(
    `INSERT INTO Booking (userId, campgroundId, checkInDate, checkOutDate, createdAt,amount) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, campgroundId, checkInDate, checkOutDate, new Date(), amount]
  );
  return rows[0];
};
