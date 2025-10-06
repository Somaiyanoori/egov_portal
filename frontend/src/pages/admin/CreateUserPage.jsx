import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserByAdmin,
  getAllDepartments,
} from "../../services/adminService.js";

// Component for the admin to create a new user.
const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
    department_id: "",
    job_title: "",
  });
  // State to store the list of available departments.
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Effect to fetch all departments when the component first mounts.
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartments();
        setDepartments(data);
      } catch (err) {
        setError("Failed to fetch departments.");
      }
    };
    fetchDepartments();
  }, []);

  // Updates the form state whenever an input field changes.
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handles the form submission logic.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dataToSubmit = { ...formData };

      // Ensure department_id is null if the user is not an officer or head.
      if (dataToSubmit.role !== "officer" && dataToSubmit.role !== "head") {
        dataToSubmit.department_id = null;
      }
      // Call the API to create the user.
      await createUserByAdmin(dataToSubmit);
      // Navigate to the user list page on success.
      navigate("/app/admin/users");
    } catch (err) {
      setError(err.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  // Renders the create user form.
  return (
    <div>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>Create New User</h1>
        <Link to="/app/admin/users" className="btn btn-secondary">
          Back to User List
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {/* Email Input */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                required
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {/* Password Input */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                required
                className="form-control"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {/* Role Selection */}
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="citizen">Citizen</option>
                <option value="officer">Officer</option>
                <option value="head">Department Head</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Conditionally render fields for officer and head roles */}

            {(formData.role === "officer" || formData.role === "head") && (
              <>
                <div className="mb-3">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    name="job_title"
                    className="form-control"
                    value={formData.job_title}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select
                    name="department_id"
                    className="form-select"
                    value={formData.department_id}
                    onChange={handleChange}
                  >
                    <option value="">Select a department...</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
