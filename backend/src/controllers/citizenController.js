// src/controllers/citizenController.js
import * as RequestModel from "../models/Request.js";
import * as DocumentModel from "../models/Document.js";
import * as PaymentModel from "../models/Payment.js";
import pool from "../config/db.js";

/**
 * Handles the creation of a new service request by a citizen.
 */
export const createRequestHandler = async (req, res) => {
  try {
    const citizen_id = req.user.id;
    const { service_id, notes } = req.body; // notes را از بدنه درخواست می‌خوانیم

    if (!service_id) {
      return res.status(400).json({ message: "Service ID is required." });
    }

    // چک کردن هزینه سرویس برای پرداخت شبیه‌سازی شده
    const serviceResult = await pool.query(
      "SELECT fee FROM services WHERE id = $1",
      [service_id]
    );
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ message: "Service not found." });
    }
    const serviceFee = parseFloat(serviceResult.rows[0].fee);

    // ایجاد درخواست جدید در دیتابیس (با notes)
    const newRequest = await RequestModel.createRequest(
      citizen_id,
      service_id,
      notes
    );

    // شبیه‌سازی پرداخت اگر سرویس هزینه داشت
    if (serviceFee > 0) {
      await PaymentModel.createPayment({
        request_id: newRequest.id,
        amount: serviceFee,
        status: "success",
        transaction_id: `SIM_${Date.now()}`,
      });
    }

    // ذخیره مدارک آپلود شده
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
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

/**
 * Fetches all requests submitted by the logged-in citizen.
 */
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
