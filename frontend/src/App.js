import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NgoRoute from './components/NgoRoute'; // <-- 1. IMPORT
import NgoDashboardPage from './pages/NgoDashboardPage'; // <-- 2. IMPORT

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Wrap the DashboardPage route with our ProtectedRoute component */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      {/* Add the new Admin route */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboardPage />
        </AdminRoute>
      } />

      {/* -- 3. ADD THE NEW NGO ROUTE -- */}
      <Route path="/ngo" element={
        <NgoRoute>
          <NgoDashboardPage />
        </NgoRoute>
      } />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;