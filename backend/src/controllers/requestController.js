import * as Request from "../models/Request.js";
import * as Document from "../models/Document.js";
import * as RequestModel from "../models/Request.js";
// save new document
export const createRequestHandler = async (req, res) => {
  try {
    const citizen_id = req.user.id;
    const { service_id } = req.body;

    const request = await Request.createRequest(citizen_id, service_id);
    if (req.files) {
      for (const file of req.files) {
        await Document.addDocument(request.id, file.path);
      }
    }
    res.status(201).json({ message: "Request created successfully", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating request." });
  }
};

//get user request
export const getUserRequestsHandler = async (req, res) => {
  try {
    const citizen_id = req.user.id;
    const requests = await Request.getRequestsByCitizen(citizen_id);

    res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user requests." });
  }
};

export const getRequestDetailsHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await RequestModel.findRequestByIdWithDetails(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }
    const user = req.user;
    const isOwner = user.role === "citizen" && request.citizen.id === user.id;
    const isAuthorizedOfficer =
      ["officer", "head"].includes(user.role) &&
      request.department.id === user.department_id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAuthorizedOfficer && !isAdmin) {
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
