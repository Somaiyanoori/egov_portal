import * as DepartmentModel from "../models/Department.js";
import * as ServiceModel from "../models/Service.js";
import * as UserModel from "../models/User.js";

// Department Handlers
export const createDepartmentHandler = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Department name is required." });
    }
    const newDepartment = await DepartmentModel.createDepartment(
      name,
      description
    );
    res
      .status(201)
      .json({
        message: "Department created successfully.",
        department: newDepartment,
      });
  } catch (error) {
    console.error("ERROR in createDepartmentHandler:", error);
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ message: "A department with this name already exists." });
    }
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllDepartmentsHandler = async (req, res) => {
  try {
    const departments = await DepartmentModel.findAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error getting departments:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Service Handlers
export const createServiceHandler = async (req, res) => {
  try {
    const { name, department_id } = req.body;
    if (!name || !department_id) {
      return res
        .status(400)
        .json({ message: "Service name and department ID are required." });
    }
    const newService = await ServiceModel.createService(req.body);
    res
      .status(201)
      .json({ message: "Service created successfully.", service: newService });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllServicesHandler = async (req, res) => {
  try {
    const services = await ServiceModel.findAllServicesWithDetails();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error getting services:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// User Management
export const getAllUsersHandler = async (req, res) => {
  try {
    const users = await UserModel.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
