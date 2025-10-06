import * as ReportModel from "../models/Report.js";

// Generates and returns system-wide reports and statistics.
export const getSystemReports = async (req, res) => {
  try {
    // Run both statistical queries in parallel for better performance.
    const [overallStats, statsByDepartment] = await Promise.all([
      ReportModel.getOverallStats(),
      ReportModel.getStatsByDepartment(),
    ]);

    // Send the combined report data in the response.
    res.status(200).json({
      overallStats,
      statsByDepartment,
    });
  } catch (error) {
    // Log any errors and send a server error response.
    console.error("Error generating reports:", error);
    res.status(500).json({ message: "Failed to generate reports." });
  }
};
