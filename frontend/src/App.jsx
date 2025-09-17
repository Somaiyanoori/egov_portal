import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import ProtectedRoute from './components/ProtectedRoute'; 
    import NewRequestPage from './pages/citizen/NewRequestPage';

    const RegisterPage = () => <h2>Register Page</h2>;
    const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

  function App() {
      return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/new"
            element={
              <ProtectedRoute>
                <NewRequestPage />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      );
    }

    export default App;
    