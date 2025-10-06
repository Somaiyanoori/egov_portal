import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRequestDetails } from "../../services/officerService";

// Component to display the detailed view of a single request.
const RequestDetailPage = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getRequestDetails(requestId);
        setRequest(data.request);
      } catch (err) {
        setError("Failed to fetch request details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [requestId]); // Rerun the effect if the requestId changes.

  // Conditional rendering for loading, error, and no-data states.
  if (loading) return <div>Loading details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!request) return <div>Request not found.</div>;

  // Base URL of the backend server for constructing file download links.
  const baseURL = "https://egov-portal-backend.onrender.com/"; // آدرس بک‌اند برای دانلود فایل

  // Render the request details UI.
  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-secondary mb-4">
        &larr; Back to Dashboard
      </Link>
      <h1>Request Details #{request.id}</h1>

      {/* Card for general request information. */}
      <div className="card">
        <div className="card-header">General Information</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <b>Status:</b> {request.status}
          </li>
          <li className="list-group-item">
            <b>Service:</b> {request.service.name}
          </li>
          <li className="list-group-item">
            <b>Department:</b> {request.department.name}
          </li>
        </ul>
      </div>

      {/* Card for citizen's information. */}
      <div className="card mt-4">
        <div className="card-header">Citizen Information</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <b>Name:</b> {request.citizen.name}
          </li>
          <li className="list-group-item">
            <b>Email:</b> {request.citizen.email}
          </li>
        </ul>
      </div>

      {/* Card for listing uploaded documents. */}
      <div className="card mt-4">
        <div className="card-header">Uploaded Documents</div>
        <div className="card-body">
          {/* Check if documents exist and render them as links. */}
          {request.documents && request.documents.length > 0 ? (
            <ul className="list-group">
              {request.documents.map((doc) => (
                <li key={doc.id} className="list-group-item">
                  <a
                    href={`${baseURL}/${doc.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Document ID: {doc.id}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            // Display a message if no documents are associated with the request.
            <p>No documents were uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;
