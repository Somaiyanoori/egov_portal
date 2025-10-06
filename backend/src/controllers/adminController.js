import * as DepartmentModel from "../models/Department.js";
import * as ServiceModel from "../models/Service.js";
import * as UserModel from "../models/User.js";
import bcrypt from "bcryptjs";
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
    res.status(201).json({
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

export const updateUserHandler = async (req, res) => {
  try {
    const { password, ...updates } = req.body;
    const cleanUpdates = {};

    // Copy over all valid string fields
    if (updates.name) cleanUpdates.name = updates.name;
    if (updates.email) cleanUpdates.email = updates.email;
    if (updates.role) cleanUpdates.role = updates.role;
    if (updates.job_title) cleanUpdates.job_title = updates.job_title;

    if (updates.department_id === "") {
      cleanUpdates.department_id = null;
    } else if (updates.department_id) {
      cleanUpdates.department_id = updates.department_id;
    }

    // Only hash and add the password if a new one was provided.
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

export const deleteUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.deleteUserById(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getUserByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateDepartmentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Department name is required." });
    }
    const updated = await DepartmentModel.updateDepartmentById(
      id,
      name,
      description
    );
    if (!updated) {
      return res.status(404).json({ message: "Department not found." });
    }
    res.status(200).json({
      message: "Department updated successfully.",
      department: updated,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteDepartmentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DepartmentModel.deleteDepartmentById(id);
    if (!deleted) {
      return res.status(404).json({ message: "Department not found." });
    }
    res.status(200).json({ message: "Department deleted successfully." });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Failed to delete department." });
  }
};
export const createUserHandler = async (req, res) => {
  try {
    const { name, email, password, role, department_id, job_title } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, password, and role are required." });
    }

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "A user with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await UserModel.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      department_id:
        role === "officer" || role === "head" ? department_id : null,
      job_title: role === "officer" || role === "head" ? job_title : null,
    });

    const { password: _, ...userToReturn } = newUser;
    res
      .status(201)
      .json({ message: "User created successfully.", user: userToReturn });
  } catch (error) {
    console.error("Error in createUserHandler:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export const getDepartmentByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await DepartmentModel.findDepartmentById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }
    res.status(200).json({ department });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export const updateServiceHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await ServiceModel.updateServiceById(id, req.body);
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found." });
    }
    res.status(200).json({
      message: "Service updated successfully.",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteServiceHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ServiceModel.deleteServiceById(id);
    if (!deleted) {
      return res.status(404).json({ message: "Service not found." });
    }
    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export const getServiceByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceModel.findServiceById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }
    res.status(200).json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
