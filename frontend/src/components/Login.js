import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  
  const handleChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8088/api/auth/login", user)
      .then((response) => {
        console.log("Login successful:", response.data);
        
        // Save token and user data
        if (response.data.data && response.data.data.token) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
        }
        
        // Redirect to home
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert(error.response?.data?.msg || "Login failed. Please try again.");
      });
  };
  
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MDBContainer className="d-flex align-items-center justify-content-center bg-image">
        <div className="mask gradient-custom-3"></div>
        <MDBCard className="m-5" style={{ maxWidth: "600px" }}>
          <MDBCardBody className="px-5">
            <h2 className="text-uppercase text-center mb-5">Sign In to your account</h2>
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="form"
                size="lg"
                placeholder="Enter email"
                onChange={handleChange}
                id="email"
                value={user.email}
              />
              <MDBInput
                wrapperClass="form"
                size="lg"
                type="password"
                placeholder="Enter password"
                onChange={handleChange}
                id="password"
                value={user.password}
              />
              <MDBBtn className="btn shadow-none" type="submit">
                SignIn
              </MDBBtn>
              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account? <Link to="/register">Sign up</Link>
                </p>
                <p className="mb-0 mt-2">
                  Forgot your password? <Link to="/forgot-password">reset password</Link>
                </p>
              </div>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default Login;