// src/controllers/requestController.js
import * as RequestModel from "../models/Request.js";

/**
 * Fetches the detailed information of a single request.
 * Authorization is handled within to allow access for owner, relevant officer, or admin.
 */
export const getRequestDetailsHandler = async (req, res) => {
  // <<<< مطمئن شوید export وجود دارد
  try {
    const { id } = req.params;
    const request = await RequestModel.findRequestByIdWithDetails(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // بررسی سطح دسترسی
    const user = req.user;
    const isAdmin = user.role === "admin";
    const isOwner = user.role === "citizen" && request.citizen.id === user.id;
    const isAuthorizedOfficer =
      ["officer", "head"].includes(user.role) &&
      request.department.id === user.department_id;

    if (!isAdmin && !isOwner && !isAuthorizedOfficer) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this request." });
    }

    res.status(200).json({ request });
  } catch (error) {
    console.error("Error fetching request details:", error);
    res.status(500).json({ message: "Server error." });
  }
};
