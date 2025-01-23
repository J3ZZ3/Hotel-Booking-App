import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin";
import AddAdmin from "./components/admin/AddAdmin";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import ClientDashboard from "./components/client/ClientDashboard"; // Import ClientDashboard
import ClientLogin from "./components/client/ClientLogin"; // Import ClientLogin
import BookingHistory from "./components/client/BookingHistory"; // Import BookingHistory
import BookingStatus from "./components/client/BookingStatus"; // Import BookingStatus
import ClientRegister from "./components/client/ClientRegister"; // Import ClientRegister

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-admin"
            element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            }
          />
          {/* Client Routes */}
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-register" element={<ClientRegister />} />
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-history"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-status/:roomId"
            element={
              <ProtectedRoute>
                <BookingStatus />
              </ProtectedRoute>
            }
          />
          {/* Add other protected routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;