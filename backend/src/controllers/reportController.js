import * as ReportModel from "../models/Report.js";

export const getSystemReports = async (req, res) => {
  try {
    // Run both queries in parallel for better performance
    const [overallStats, statsByDepartment] = await Promise.all([
      ReportModel.getOverallStats(),
      ReportModel.getStatsByDepartment(),
    ]);

    res.status(200).json({
      overallStats,
      statsByDepartment,
    });
  } catch (error) {
    console.error("Error generating reports:", error);
    res.status(500).json({ message: "Failed to generate reports." });
  }
};
