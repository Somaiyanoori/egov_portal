
    import React, { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '../../context/AuthContext';
    import { getPendingRequests, processRequest } from '../../services/officerService';
    const OfficerDashboard = () => {
      const { user } = useAuth();
      const [requests, setRequests] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
          const data = await getPendingRequests();
          setRequests(data.requests);
        } catch (err) {
          setError('Error retrieving request list.');
        } finally {
          setLoading(false);
        }
      }, []);

      useEffect(() => {
        fetchRequests();
      }, [fetchRequests]);

      const handleProcessRequest = async (requestId, newStatus) => {
        const originalRequests = [...requests];
        setRequests(prev => prev.filter(r => r.id !== requestId));
        
        try {
            await processRequest(requestId, newStatus);

        } catch (err) {
            setError(`Error processing request ${requestId}.`);
            setRequests(originalRequests);
        }
      };

      if (loading) return <div>Loading requests...</div>;
      if (error) return <div className="alert alert-danger">{error}</div>
      return (
        <div>
          <h1>Employee dashboard</h1>
          <p>Welcome , {user.name} ({user.job_title})!</p>
          
          <h2>Pending requests</h2>
          {requests.length === 0 ? (
            <p>There are currently no pending applications for your department.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                 
<th>Application Number</th>
<th>Citizen Name</th>
<th>Service Name</th>
<th>Registration Date</th>
<th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.citizen_name}</td>
                    <td>{req.service_name}</td>
                    <td>{new Date(req.created_at).toLocaleDateString('fa-IR')}</td>
                    <td>
                      {/* TODO: Link to detail page */}
                      <button 
                        className="btn btn-sm btn-success ms-2"
                        onClick={() => handleProcessRequest(req.id, 'approved')}
                      >
                        تایید
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleProcessRequest(req.id, 'rejected')}
                      >
                        رد
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    };

    export default OfficerDashboard;
  