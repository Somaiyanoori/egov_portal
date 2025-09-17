    // src/pages/admin/AdminDashboard.jsx
    import React from 'react';
    import { useAuth } from '../../context/AuthContext';

    const AdminDashboard = () => {
      const { user } = useAuth();
      return (
        <div>
          <h1>Admin dashboard</h1>
          <p> Welcome ، {user.name}!</p>
\
        </div>
      );
    };
    export default AdminDashboard;
    
