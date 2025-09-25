// src/pages/admin/ManageDepartmentsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getAllDepartments,
  createDepartment,
  deleteDepartment,
} from "../../services/adminService";
import { Link } from "react-router-dom";

const ManageDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (err) {
      setError("Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDepartment(newDepartment);
      setNewDepartment({ name: "", description: "" }); // Reset form
      fetchDepartments(); // Refresh list
    } catch (err) {
      setError(err.message || "Failed to create department.");
    }
  };

  const handleDelete = async (departmentId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this department? This might affect existing services and users."
      )
    ) {
      try {
        await deleteDepartment(departmentId);
        fetchDepartments(); // Refresh list
      } catch (err) {
        setError("Failed to delete department.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Departments</h1>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Form for creating a new department */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Create New Department</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Department Name</label>
              <input
                type="text"
                name="name"
                value={newDepartment.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={newDepartment.description}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>

      {/* Table of existing departments */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep.id}>
              <td>{dep.id}</td>
              <td>{dep.name}</td>
              <td>{dep.description}</td>
              <td>
                {/* TODO: Add link to an edit page */}
                <button className="btn btn-sm btn-warning me-2" disabled>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dep.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDepartmentsPage;
