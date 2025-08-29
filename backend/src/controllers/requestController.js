import * as Request from "../models/Request.js";
import * as Document from "../models/Document.js";
// save new document
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
