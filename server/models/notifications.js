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
  const [result] = await connection.query(`SELECT cg.title FROM Campground as cg
  LEFT JOIN Booking as bk ON cg.id = bk.campgroundId
  `);

  const [newNotification] = await connection.query(`INSERT INTO Notifications (content,userId) VALUES (?,?)`, [
    `You have a new Booking for ${result[0].title} from userId - ${userId}`,
    userId,
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
