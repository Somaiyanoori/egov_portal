// src/App.jsx
import { Routes, Route } from 'react-router-dom';
const LoginPage = () => <h2>Login Page</h2>;
const RegisterPage = () => <h2>Register Page</h2>;
const DashboardPage = () => <h2>Dashboard Page</h2>;
const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
