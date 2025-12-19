import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(
        "http://localhost:6007/api/users/dashboard",
        { headers }
      );

      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentUsers(response.data.data.recentUsers);
        setRecentTrips(response.data.data.recentTrips);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:6007/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchDashboardData();
    } catch (err) {
      alert("Failed to delete trip");
      console.error("Delete trip error:", err);
    }
  };

  if (loading) return <div className="main-content">Loading dashboard...</div>;
  if (error)
    return (
      <div className="main-content">
        <p className="muted">{error}</p>
      </div>
    );

  return (
    <div className="main-content">
      <h1 className="section-title">Admin Dashboard</h1>
      <p className="muted">Manage your travel platform</p>

      {/* Stats Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          marginBottom: "2rem",
        }}
      >
        <div className="card">
          <div className="card-body">
            <h3>{stats?.totalUsers || 0}</h3>
            <p className="muted">Total Users</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>{stats?.totalTrips || 0}</h3>
            <p className="muted">Total Trips</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>{stats?.activeTrips || 0}</h3>
            <p className="muted">Active Trips</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>{stats?.featuredTrips || 0}</h3>
            <p className="muted">Featured Trips</p>
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Recent Trips</h3>
          <button
            className="btn"
            onClick={() => navigate("/admin/add-trip")}
            style={{ background: "var(--accent)", color: "var(--text)" }}
          >
            + Add Trip
          </button>
        </div>
        <div style={{ padding: "1rem" }}>
          {recentTrips.map((trip) => (
            <div
              key={trip._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: "1rem" }}>{trip.title}</h4>
                <p className="muted" style={{ margin: 0 }}>
                  {trip.destination} • {trip.price} TND
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    navigate(`/admin/edit-trip/${trip._id}`);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn secondary"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                  onClick={() => handleDeleteTrip(trip._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <div
          style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}
        >
          <h3>Recent Users</h3>
        </div>
        <div style={{ padding: "1rem" }}>
          {recentUsers.map((user) => (
            <div
              key={user._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: "1rem" }}>{user.userName}</h4>
                <p className="muted" style={{ margin: 0 }}>
                  {user.email}
                </p>
              </div>
              <span
                style={{
                  background:
                    user.role === "admin" ? "var(--accent)" : "var(--primary)",
                  color: user.role === "admin" ? "var(--text)" : "white",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                }}
              >
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
