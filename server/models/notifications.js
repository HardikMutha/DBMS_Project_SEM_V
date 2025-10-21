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
