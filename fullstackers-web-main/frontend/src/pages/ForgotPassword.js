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

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await axios.post(
        "http://localhost:6007/api/auth/forgot-password", 
        { email }
      );
      
      setMessage("Password reset email sent! Please check your inbox.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MDBContainer className="d-flex align-items-center justify-content-center bg-image">
        <div className="mask gradient-custom-3"></div>
        <MDBCard className="m-5" style={{ maxWidth: "600px" }}>
          <MDBCardBody className="px-5">
            <h2 className="text-uppercase text-center mb-5">Forgot Password</h2>
            {message && (
              <div className={`alert ${message.includes('sent') ? 'alert-success' : 'alert-danger'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="form"
                size="lg"
                placeholder="Enter your email"
                onChange={handleChange}
                value={email}
                type="email"
                required
              />
              <MDBBtn className="btn shadow-none" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Email'}
              </MDBBtn>
              <div className="text-center mt-3">
                <p className="mb-0">
                  Remember your password? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default ForgotPassword;