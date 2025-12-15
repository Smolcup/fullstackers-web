import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const url = "http://localhost:8088/api/auth/register";  // ✅ Fixed endpoint
  const navigate = useNavigate();

  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });
  
  const handleChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(url, user)
      .then((response) => {
        console.log(response.data);
        alert(response.data.msg || "Registration successful!");
        navigate("/login");  // Redirect to login page
      })
      .catch((error) => {
        // Better error handling
        const errorMsg = error.response?.data?.msg || "Registration failed";
        alert(errorMsg);
        console.error("Registration error:", error);
      });
  };
  
  return (
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center bg-image"
      style={{ height: '100vh', width: '100vw' }}
    >
      <div className="mask gradient-custom-3"></div>
      <MDBCard className="m-5" style={{ maxWidth: "600px" }}>
        <MDBCardBody className="px-5">
          <h2 className="text-uppercase text-center mb-5">Create an account</h2>
          <form onSubmit={handleSubmit}>
            <MDBInput
              wrapperClass="form"
              size="lg"
              type="text"
              placeholder="Enter username"
              onChange={handleChange}
              id="userName"
              required
            />
            <MDBInput
              wrapperClass="form"
              size="lg"
              type="email"
              placeholder="Enter email"
              onChange={handleChange}
              id="email"
              required
            />
            <MDBInput
              wrapperClass="form"
              size="lg"
              type="password"
              placeholder="Enter password"
              onChange={handleChange}
              id="password"
              required
            />
            <MDBBtn
              className="button w-100"
              size="lg"
              type="submit"
            >
              Register
            </MDBBtn>
            <div className="text-center mt-3">
              <p className="mb-0">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Register;