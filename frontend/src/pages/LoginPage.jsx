    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { login as loginService } from '../services/authService';
     import { useAuth } from '../context/AuthContext'; 

    const LoginPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(false);
      const { login } = useAuth();
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

          try {
          const data = await loginService(email, password); 
          login(data.user);
          navigate('/dashboard'); 
        } catch (err) {
          setError(err.message || 'Failed to login.');
        } finally {
          setLoading(false);
        }
      };
      return (
        <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Login to the system</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
              {loading ? 'loading' : 'login'}
            </button>
          </form>
        </div>
      );
    };

    export default LoginPage;
    
