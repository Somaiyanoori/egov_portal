import {
  getPendingRequestsByDepartment,
  updateRequestStatus,
} from "../models/Request.js";
import { findUserById } from "../models/User.js";

export const getPendingRequests = async (req, res) => {
  try {
    const officer = await findUserById(req.user.id);
    if (!officer || !officer.department_id) {
      return res
        .status(403)
        .json({ message: "You are not assigned to a department." });
    }

    const requests = await getPendingRequestsByDepartment(
      officer.department_id
    );

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const processRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { newStatus } = req.body;

    if (!newStatus || (newStatus !== "approved" && newStatus !== "rejected")) {
      return res.status(400).json({
        message: "Invalid status provided. Use 'approved' or 'rejected'.",
      });
    }

    const updatedRequest = await updateRequestStatus(requestId, newStatus);
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }
    // notification

    res.status(200).json({
      message: `Request ${requestId} has been ${newStatus}.`,
      request: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
