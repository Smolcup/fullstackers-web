import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    try {
      const response = await axios.post(
        `http://localhost:6007/api/auth/reset-password/${token}`, 
        { password }
      );
      
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to reset password");
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
            <h2 className="text-uppercase text-center mb-5">Reset Password</h2>
            {message && (
              <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="form"
                size="lg"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <MDBInput
                wrapperClass="form"
                size="lg"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <MDBBtn className="btn shadow-none" type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default ResetPassword;