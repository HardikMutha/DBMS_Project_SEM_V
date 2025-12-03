import { getDBConnection } from "../db/config.js";
import { getNotificationsQuery, updateNotificationsQuery } from "../models/notifications.js";

export const getNotifications = async (req, res) => {
  const connection = await getDBConnection();
  const userId = req?.user?.id;
  if (!connection) {
    return res.status(500).json({ error: 'Database connection not available' });
  }
  try {
    await connection.beginTransaction();
    const notifications = await getNotificationsQuery(connection, { userId });
    await connection.commit();
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

export const updateNotification = async (req, res) => {
  const connection = await getDBConnection();
  const { notificationId } = req.body;
  if (!connection) {
    return res.status(500).json({ error: 'Database connection not available' });
  }
  try {
    if (!notificationId) {
      return res.status(400).json({ error: 'Notification ID is required' });
    }
    await connection.beginTransaction();
    const result = await updateNotificationsQuery(connection, { viewedNotifications: [notificationId] });
    await connection.commit();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating notification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};