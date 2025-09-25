import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllServices, createRequest } from "../../services/requestService";

const NewRequestPage = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);
      } catch (err) {
        setError("Error retrieving service list.");
      }
    };
    fetchServices();
  }, []);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) {
      setError("Please select a service.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("service_id", selectedService);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("documents", files[i]);
      }
    }

    try {
      await createRequest(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error registering request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register a new request</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="service" className="form-label">
            Service selection
          </label>
          <select
            id="service"
            className="form-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
          >
            <option value="" disabled>
              Choose a service...
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.department_name} - {service.name} (Cost: {service.fee}{" "}
                afg)
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="documents" className="form-label">
            Upload documents (optional)
          </label>
          <input
            type="file"
            id="documents"
            className="form-control"
            onChange={handleFileChange}
            multiple
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Request request"}
        </button>
      </form>
    </div>
  );
};

export default NewRequestPage;
