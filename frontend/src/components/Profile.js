import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function Profile() {
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [userUpdate, setUpdate] = useState({
    userName: "",
    email: "",
    age: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        // Decode token to verify it's valid
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
        
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        // Correct endpoint for profile
        const response = await axios.get(
          "http://localhost:8088/api/auth/profile", 
          { headers }
        );
        
        console.log("Profile API response:", response.data);
        
        // Set user data based on your backend response structure
        // Adjust this based on what you see in console
        if (response.data.data) {
          setUser(response.data.data);
        } else if (response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(response.data);
        }
        
      } catch (error) {
        console.error("Profile fetch error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    };

    fetchUserProfile();
  }, []); // Runs once when component mounts

  const handleChange = (e) => {
    setUpdate({ ...userUpdate, [e.target.id]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      // You need to check what your update endpoint is
      // This should be /api/users/:id or similar
      await axios.put(
        `http://localhost:8088/api/users/${user._id}`, 
        userUpdate, 
        { headers }
      );
      
      // Refresh user data
      const response = await axios.get(
        "http://localhost:8088/api/auth/profile", 
        { headers }
      );
      
      if (response.data.data) {
        setUser(response.data.data);
      }
      
      handleClose();
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      alert(error.response?.data?.msg || "Update failed");
    }
  };

  return (
    <div className="profile-container" style={{ padding: '20px' }}>
      <h3 className="welcome-back">Welcome Back</h3>
      
      {/* Debug info - remove after testing */}
      <div style={{ color: 'gray', fontSize: '12px', marginBottom: '10px' }}>
        User ID: {user._id || 'Not loaded'} | 
        Token: {localStorage.getItem("token") ? 'Present' : 'Missing'}
      </div>
      
      <Card className="profile-card" style={{ maxWidth: '500px' }}>
        <Card.Body>
          <div className="user-detail" style={{ marginBottom: '15px' }}>
            <h6>UserName:</h6>
            <Card.Text>{user.userName || 'Loading...'}</Card.Text>
          </div>
          
          <div className="user-detail" style={{ marginBottom: '15px' }}>
            <h6>Email:</h6>
            <Card.Text>{user.email || 'Loading...'}</Card.Text>
          </div>
          
          <div className="update-button">
            <Button variant="success" onClick={handleShow}>
              Update Profile
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder={user.userName || 'Enter username'}
                onChange={handleChange}
                id="userName"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder={user.email || 'Enter email'}
                onChange={handleChange}
                id="email"
              />
            </Form.Group>
            
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;