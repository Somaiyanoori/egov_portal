import bcrypt from "bcryptjs";
import * as DepartmentModel from "../models/Department.js";
import * as ServiceModel from "../models/Service.js";
import * as UserModel from "../models/User.js";

/** Helper to handle common server errors and reduce code repetition. */
const handleServerError = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
  if (error.code === "23505") {
    // Handles unique constraint violations.
    return res
      .status(409)
      .json({ message: `A resource with this value already exists.` });
  }
  res.status(500).json({ message: "Internal server error." });
};

// --- Department Handlers ---

/** Fetches all departments. */
export const getAllDepartmentsHandler = async (req, res) => {
  try {
    const departments = await DepartmentModel.findAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    handleServerError(res, error, "getAllDepartments");
  }
};

/** Fetches a single department by ID. */
export const getDepartmentByIdHandler = async (req, res) => {
  try {
    const department = await DepartmentModel.findDepartmentById(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Department not found." });
    res.status(200).json({ department });
  } catch (error) {
    handleServerError(res, error, "getDepartmentById");
  }
};

/** Creates a new department. */
export const createDepartmentHandler = async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(400).json({ message: "Department name is required." });
    const newDepartment = await DepartmentModel.createDepartment(req.body);
    res.status(201).json({
      message: "Department created successfully.",
      department: newDepartment,
    });
  } catch (error) {
    handleServerError(res, error, "createDepartment");
  }
};

/** Updates an existing department. */
export const updateDepartmentHandler = async (req, res) => {
  try {
    const updated = await DepartmentModel.updateDepartmentById(
      req.params.id,
      req.body
    );
    if (!updated)
      return res.status(404).json({ message: "Department not found." });
    res.status(200).json({
      message: "Department updated successfully.",
      department: updated,
    });
  } catch (error) {
    handleServerError(res, error, "updateDepartment");
  }
};

/** Deletes a department. */
export const deleteDepartmentHandler = async (req, res) => {
  try {
    const deleted = await DepartmentModel.deleteDepartmentById(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Department not found." });
    res.status(200).json({ message: "Department deleted successfully." });
  } catch (error) {
    handleServerError(res, error, "deleteDepartment");
  }
};

// --- Service Handlers ---

/** Fetches all services. */
export const getAllServicesHandler = async (req, res) => {
  try {
    const services = await ServiceModel.findAllServicesWithDetails();
    res.status(200).json(services);
  } catch (error) {
    handleServerError(res, error, "getAllServices");
  }
};

/** Fetches a single service by ID. */
export const getServiceByIdHandler = async (req, res) => {
  try {
    const service = await ServiceModel.findServiceById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service not found." });
    res.status(200).json({ service });
  } catch (error) {
    handleServerError(res, error, "getServiceById");
  }
};

/** Creates a new service. */
export const createServiceHandler = async (req, res) => {
  try {
    if (!req.body.name || !req.body.department_id) {
      return res
        .status(400)
        .json({ message: "Service name and department ID are required." });
    }
    const newService = await ServiceModel.createService(req.body);
    res
      .status(201)
      .json({ message: "Service created successfully.", service: newService });
  } catch (error) {
    handleServerError(res, error, "createService");
  }
};

/** Updates an existing service. */
export const updateServiceHandler = async (req, res) => {
  try {
    const updated = await ServiceModel.updateServiceById(
      req.params.id,
      req.body
    );
    if (!updated)
      return res.status(404).json({ message: "Service not found." });
    res
      .status(200)
      .json({ message: "Service updated successfully.", service: updated });
  } catch (error) {
    handleServerError(res, error, "updateService");
  }
};

/** Deletes a service. */
export const deleteServiceHandler = async (req, res) => {
  try {
    const deleted = await ServiceModel.deleteServiceById(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Service not found." });
    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    handleServerError(res, error, "deleteService");
  }
};

// --- User Handlers ---

/** Fetches all users for the admin list. */
export const getAllUsersHandler = async (req, res) => {
  try {
    const users = await UserModel.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    handleServerError(res, error, "getAllUsers");
  }
};

/** Fetches a single user by ID. */
export const getUserByIdHandler = async (req, res) => {
  try {
    const user = await UserModel.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user });
  } catch (error) {
    handleServerError(res, error, "getUserById");
  }
};

/** Creates a new user (admin action). */
export const createUserHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, password, and role are required." });
    }
    if (await UserModel.findUserByEmail(email)) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await UserModel.createUser({
      ...req.body,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User created successfully.", user: newUser });
  } catch (error) {
    handleServerError(res, error, "createUser");
  }
};

/** Updates an existing user. */
export const updateUserHandler = async (req, res) => {
  try {
    const { password, ...updates } = req.body;
    const cleanUpdates = {};
    // 2. Copy only the fields we want to update.
    if (updates.name) cleanUpdates.name = updates.name;
    if (updates.email) cleanUpdates.email = updates.email;
    if (updates.role) cleanUpdates.role = updates.role;
    if (updates.job_title) cleanUpdates.job_title = updates.job_title;

    // 3. Explicitly handle department_id: convert empty string to null.
    if (updates.department_id === "") {
      cleanUpdates.department_id = null;
    } else if (updates.department_id) {
      cleanUpdates.department_id = parseInt(updates.department_id, 10);
    }

    // 4. Only hash and add the password if a new one was provided.
    if (password) {
      cleanUpdates.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await UserModel.updateUserById(
      req.params.id,
      cleanUpdates
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found." });

    res
      .status(200)
      .json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
