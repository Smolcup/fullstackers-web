import "./App.css";
import { Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import Marketplace from "./pages/Marketplace";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Customers from "./components/Customers";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";

import AdminDashboard from "./pages/AdminDashboard";
import TripDetail from "./pages/TripDetail";
import SearchResults from "./pages/SearchResults";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TripBooking from "./pages/TripBooking";
import EditTrip from "./pages/EditTrip";

import Register from "./components/Register";
import Login from "./components/Login";

import AddTrip from "./pages/AddTrip";

import ChatBot from "./components/ChatBot";

import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";

function App() {
  return (
    <DarkModeProvider>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/admin/add-trip"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AddTrip />
                </PrivateRoute>
              }
            />
            <Route path="/book-trip/:id" element={<TripBooking />} />
            <Route
              path="/admin/edit-trip/:id"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <EditTrip />
                </PrivateRoute>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <PrivateRoute allowedRoles={["user", "admin"]}>
                  <MyBookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminBookings />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/customers"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <Customers />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute allowedRoles={["user"]}>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </DarkModeProvider>
  );
}

export default App;
