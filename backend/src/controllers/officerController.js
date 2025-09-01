import * as RequestModel from "../models/Request.js";
import * as UserModel from "../models/User.js";

export const getPendingRequests = async (req, res) => {
  try {
    const officer = await UserModel.findUserById(req.user.id);
    if (!officer || !officer.department_id) {
      return res
        .status(403)
        .json({ message: "You are not assigned to a department." });
    }

    const requests = await RequestModel.findPendingRequestsByDepartment(
      officer.department_id
    );
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const processRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!status || !["approved", "rejected", "under_review"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    // Future check: Ensure the officer's department matches the request's department

    const updatedRequest = await RequestModel.updateRequestStatus(
      requestId,
      status
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    // TODO: Create a notification for the citizen

    res.status(200).json({
      message: `Request #${requestId} has been updated to '${status}'.`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Server error." });
  }
};
