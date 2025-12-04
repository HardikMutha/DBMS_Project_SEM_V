export const createApprovalNotificationQuery = async (connection, { requestId, userId }) => {
  const [newNotification] = await connection.query(`INSERT INTO Notifications (content, userId) VALUES (?, ?)`, [
    `Your request ${requestId} has been approved.`,
    userId,
  ]);
  const [approvalNotification] = await connection.query(`INSERT INTO ApprovalNotif (notifId, requestId) VALUES (?, ?)`, [
    newNotification.insertId,
    requestId,
  ]);
  return { newNotification, approvalNotification };
};

export const createRejectNotificationQuery = async (connection, { requestId, userId, content }) => {
  const [newNotification] = await connection.query(`INSERT INTO Notifications (content,userId) VALUES (?, ?)`, [
    content + `\n Your request ${requestId} has been rejected`,
    userId,
  ]);
  const [rejectNotification] = await connection.query(`INSERT INTO ApprovalNotif (notifId,requestId) VALUES (?, ?)`, [
    newNotification.insertId,
    requestId,
  ]);
  return { newNotification, rejectNotification };
};

export const createBookingNotificationQuery = async (connection, { bookingId, userId }) => {
  const [user] = await connection.query(`SELECT username FROM Users WHERE id = ?`, [userId]);
  const [bookingDetails] = await connection.query(
    `SELECT bk.*, cg.title, cg.ownerId 
     FROM Booking AS bk 
     JOIN Campground AS cg ON bk.campgroundId = cg.id 
     WHERE bk.bookingId = ?`,
    [bookingId]
  );

  if (!bookingDetails.length) {
    throw new Error("Booking not found");
  }

  const booking = bookingDetails[0];
  const guest = user[0];

  const checkIn = new Date(booking.checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const checkOut = new Date(booking.checkOutDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const content = `You Have a New Booking!\n${guest.username} booked "${booking.title}" for ${booking.guestCount} guest${
    booking.guestCount > 1 ? "s" : ""
  }.\n📅 ${checkIn} → ${checkOut}\n Estimated Revenue - $${booking.amount}`;

  const [newNotification] = await connection.query(`INSERT INTO Notifications (content, userId) VALUES (?, ?)`, [
    content,
    booking.ownerId,
  ]);
  const [bookingNotification] = await connection.query(`INSERT INTO BookingNotif (notifId, bookingId) VALUES (?, ?)`, [
    newNotification?.insertId,
    bookingId,
  ]);
  return { newNotification, bookingNotification };
};

export const updateNotificationsQuery = async (connection, { viewedNotifications }) => {
  const placeholder = viewedNotifications.map(() => "?").join(",");
  const [result] = await connection.query(`UPDATE Notifications as ntf SET ntf.viewed = 1 WHERE ntf.id IN (${placeholder})`, [
    viewedNotifications,
  ]);
  return result;
};

export const getNotificationsQuery = async (connection, { userId }) => {
  const [notifications] = await connection.query(`SELECT id, content, viewed FROM Notifications WHERE userId = ?`, [userId]);
  return notifications;
};
