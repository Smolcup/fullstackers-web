import React, { useState, useEffect } from "react";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

function Customers() {
  const url = "http://localhost:8088/api/users";  // Fixed URL
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.get(url, { headers });
      
      console.log("Users API response:", response.data);
      
      // Adjust based on your backend response
      if (response.data.users) {
        setUsers(response.data.users);
      } else if (response.data.data) {
        setUsers(response.data.data);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
      setLoading(false);
      
      if (err.response?.status === 401) {
        alert("Please login to view users");
        // Optionally redirect to login
        // window.location.href = "/login";
      }
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to delete users");
        return;
      }

      const headers = { 'Authorization': `Bearer ${token}` };
      
      await axios.delete(`${url}/${userId}`, { headers });
      
      // Update UI by removing deleted user
      setUsers(users.filter((user) => user._id !== userId));
      alert("User deleted successfully");
      
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.msg || "Failed to delete user");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading users...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", padding: "50px", color: "red" }}>{error}</div>;
  }

  if (users.length === 0) {
    return <div style={{ textAlign: "center", padding: "50px" }}>No users found</div>;
  }

  return (
    <div style={{ width: "80%", margin: "auto", marginTop: "40px" }}>
      <h2 style={{ marginBottom: "30px", textAlign: "center" }}>User Management</h2>
      
      <Accordion>
        {users.map((user) => (
          <Accordion.Item key={user._id} eventKey={user._id}>
            <Accordion.Header style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderBottom: "1px solid #dee2e6",
              cursor: "pointer",
            }}>
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <img
                  src={user.profileImage 
                    ? `http://localhost:8088/uploads/${user.profileImage}`
                    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                  }
                  style={{ 
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "50%", 
                    marginRight: "15px",
                    objectFit: "cover" 
                  }}
                  alt={user.userName}
                />
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {user.userName?.toUpperCase() || "Unknown User"}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Role: {user.role || "user"} | ID: {user._id?.substring(0, 8)}...
                  </div>
                </div>
              </div>
            </Accordion.Header>
            
            <Accordion.Body style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h5 style={{ marginBottom: "10px" }}>
                    <strong>Email:</strong> {user.email || "No email"}
                  </h5>
                  
                  <h5>
                    <strong>User ID:</strong> {user._id}
                  </h5>
                </div>
                
                <div>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user._id)}
                    style={{ minWidth: "100px" }}
                  >
                    Delete User
                  </Button>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

export default Customers;