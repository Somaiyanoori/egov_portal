
    import React from 'react';
    import { useAuth } from '../../context/AuthContext';

    const CitizenDashboard = () => {
      const { user } = useAuth();
      return (
        <div>
          <h1>Citizen dashboard</h1>
          <p>Welcome {user.name}!</p>
        </div>
      );
    };
    export default CitizenDashboard;
    
