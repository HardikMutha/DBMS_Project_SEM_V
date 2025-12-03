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

export const getAllBookingsWithDetails = async (connection) => {
  const [rows] = await connection.query(
    `SELECT 
       b.bookingId AS booking_id,
       b.checkInDate AS check_in_date,
       b.checkOutDate AS check_out_date,
       b.createdAt   AS created_at,
       b.amount      AS total_price,
       b.guestCount  AS number_of_guests,
       u.id          AS user_id,
       u.username    AS user_name,
       u.email       AS user_email,
       cg.id         AS campground_id,
       cg.title      AS campground_name,
       loc.place     AS campground_location
     FROM Booking b
     JOIN Users u ON u.id = b.userId
     JOIN Campground cg ON cg.id = b.campgroundId
     LEFT JOIN Location loc ON loc.id = cg.locId
     ORDER BY b.createdAt DESC`
  );
  return rows;
};

export const deleteBookingById = async (connection, { bookingId }) => {
  const [result] = await connection.query(`DELETE FROM Booking WHERE bookingId = ?`, [bookingId]);
  return result.affectedRows;
};

export const getBookingsByUserId = async (connection, { userId }) => {
  const [rows] = await connection.query(
    `SELECT 
       b.bookingId AS booking_id,
       b.checkInDate AS check_in_date,
       b.checkOutDate AS check_out_date,
       b.createdAt   AS created_at,
       b.amount      AS total_price,
       b.guestCount  AS number_of_guests,
       cg.id         AS campground_id,
       cg.title      AS campground_name,
       loc.place     AS campground_location
     FROM Booking b
     JOIN Campground cg ON cg.id = b.campgroundId
     LEFT JOIN Location loc ON loc.id = cg.locId
     WHERE b.userId = ?
     ORDER BY b.createdAt DESC`,
    [userId]
  );
  return rows;
};
