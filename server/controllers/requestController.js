import { getDBConnection } from "../db/config.js";
import { approveRequestQuery, getAllRequestsQuery } from "../models/request.js";
import { createApprovalNotificationQuery } from "../models/notifications.js";

export const approveCampgroundRequest = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  const { requestId } = req?.params;
  try {
    await connection.beginTransaction();
    const { updatedCampground, updatedRequest } = await approveRequestQuery(connection, { requestId });
    console.log(updatedCampground, updatedRequest);
    const { newNotification, approvalNotification } = await createApprovalNotificationQuery(connection, {
      requestId,
      userId: updatedRequest.requestedBy,
    });
    await connection.commit();
    return res
      .status(200)
      .json({ success: true, data: { updatedCampground, updatedRequest, newNotification, approvalNotification } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "An Error Occurred" });
  } finally {
    connection.release();
  }
};

export const getAllRequests = async (req, res) => {
  const connection = await getDBConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: "DB Connection Error" });
  }
  try {
    await connection.beginTransaction();
    const data = await getAllRequestsQuery(connection);
    console.log(data);
    await connection.commit();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "An Error Occured" });
  } finally {
    connection.release();
  }
};
