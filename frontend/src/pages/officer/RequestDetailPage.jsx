// frontend/src/pages/officer/RequestDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// فرض می‌کنیم فایل officerService.js از قبل ساخته شده است
import { getRequestDetails } from "../../services/officerService";

const RequestDetailPage = () => {
  const { requestId } = useParams(); // ID را از آدرس URL می‌خواند
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
  }, [requestId]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!request) return <div>Request not found.</div>;

  const baseURL = "http://localhost:3012"; // آدرس بک‌اند برای دانلود فایل

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-secondary mb-4">
        &larr; Back to Dashboard
      </Link>
      <h1>Request Details #{request.id}</h1>

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

      <div className="card mt-4">
        <div className="card-header">Uploaded Documents</div>
        <div className="card-body">
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
            <p>No documents were uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;
