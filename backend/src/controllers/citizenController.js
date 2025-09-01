import * as RequestModel from "../models/Request.js";
import * as DocumentModel from "../models/Document.js";

export const createRequestHandler = async (req, res) => {
  try {
    const citizen_id = req.user.id;
    const { service_id } = req.body;

    if (!service_id) {
      return res.status(400).json({ message: "Service ID is required." });
    }

    const newRequest = await RequestModel.createRequest(citizen_id, service_id);

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // We store the path accessible from the server URL
        const filePath = `uploads/${file.filename}`;
        await DocumentModel.addDocument(newRequest.id, filePath);
      }
    }

    res
      .status(201)
      .json({
        message: "Request submitted successfully.",
        request: newRequest,
      });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Failed to create request." });
  }
};

export const getMyRequestsHandler = async (req, res) => {
  try {
    const citizen_id = req.user.id;
    const requests = await RequestModel.findRequestsByCitizenId(citizen_id);
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ message: "Failed to fetch requests." });
  }
};
