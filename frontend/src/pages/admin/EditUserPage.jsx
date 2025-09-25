import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserById,
  updateUser,
  getAllDepartments,
} from "../../services/adminService";

const EditUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "citizen",
    department_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, departmentsResponse] = await Promise.all([
          getUserById(userId),
          getAllDepartments(),
        ]);
        setUserData({
          name: userResponse.user.name,
          email: userResponse.user.email,
          role: userResponse.user.role,
          department_id: userResponse.user.department_id || "",
        });
        setDepartments(departmentsResponse);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...userData,
        department_id: userData.department_id || null,
      };
      await updateUser(userId, dataToSubmit);
      navigate("/admin/users");
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1>Edit User: {userData.name}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="form-select"
          >
            <option value="citizen">Citizen</option>
            <option value="officer">Officer</option>
            <option value="head">Department Head</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {userData.role === "officer" || userData.role === "head" ? (
          <div className="mb-3">
            <label className="form-label">Department</label>
            <select
              name="department_id"
              value={userData.department_id}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">No Department</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditUserPage;
