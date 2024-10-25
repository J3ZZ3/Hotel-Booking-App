import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClientLogin from "./components/client/ClientLogin";
import ClientRegister from "./components/client/ClientRegister";
import AdminLogin from "./components/admin/AdminLogin";
import AdminRegister from "./components/admin/AdminResgister";
import AddAdmin from "./components/admin/AddAdmin";
import ClientDashboard from "./components/client/ClientDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import BookingStatus from "./components/client/BookingStatus";
import BookingForm from "./components/client/BookingForm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import HomePage from "./components/HomePage";
import BookingHistory from "./components/client/BookingHistory";
import CustomerBooking from "./components/admin/CustomerBookings";

function App() {
  return (
    <Router>
      <PayPalScriptProvider
        options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-admin" element={<AddAdmin />} />
          <Route path="/client-register" element={<ClientRegister />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/booking-status/:roomId" element={<BookingStatus />} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/book-room/:roomId" element={<BookingForm />} />
          <Route path="/book-room/:id" element={<BookingForm />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/customer-bookings" element={<CustomerBooking />} />
          
        </Routes>
      </PayPalScriptProvider>
    </Router>
  );
}

export default App;
