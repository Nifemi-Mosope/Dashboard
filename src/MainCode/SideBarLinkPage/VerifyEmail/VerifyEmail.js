import React, { useState } from "react";
import "../../SignUpScreen/signup.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  VerifyEmail,
  ResendVerifyEmail,
} from "../../../Features/Kitchen/KitchenSlice";
import { message, notification } from "antd";

function Verifymail() {
  const [formData, setFormData] = useState({
    Email: "",
    EmailOTP: "",
  });

  const [resendEmail, setResendEmail] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const showResend = queryParams.get("showResend") === "true";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      Email: formData.Email,
      EmailOTP: formData.EmailOTP,
    };

    try {
      const response = await VerifyEmail(payload);
      if (response.code === 200) {
        notification.success({
          message: "Login Success",
          description: "Welcome to QuicKee, become more efficient",
        });
        navigate("/signIn");
      } else if (response.message === "User not found") {
        notification.error({
          message: "Login Failed",
          description: "User not found",
        });
      } else if (response.message === "Wrong OTP") {
        notification.error({
          message: "Wrong OTP",
          description: "Check your mail for the correct OTP and try again",
        });
      } else if (response.message === "Expired OTP") {
        message.error("Expired OTP");
        setResendEmail(formData.Email);
      } else {
        notification.error({
          message: "Login Failed",
          description: "An error occurred while processing your request.",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Internal Server Error",
        description: "An error occurred while processing your request.",
      });
    }
  };

  const handleResendEmail = async () => {
    try {
      const payload = {
        Email: formData.Email,
      };

      const response = await ResendVerifyEmail(payload);
      console.log(response);
      if (response.code === 200) {
        notification.success({
          message: "Email Resent",
          description:
            "Email verification link has been resent. Check your email.",
        });
      } else {
        notification.error({
          message: "Resend Email Failed",
          description: "An error occurred while resending the email.",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Internal Server Error",
        description: "An error occurred while processing your request.",
      });
    }
  };

  return (
    <div className="glass-morphism">
      <div className="fixed-header">
        <h1 className="title" onClick={() => window.location.reload()}>
          QuicKee
        </h1>
      </div>
      <div className="rectangle">
        <div>
          <h2
            style={{
              textAlign: "center",
              marginTop: "0%",
              fontFamily: "sans-serif",
            }}
          >
            {showResend ? "Resend Verify Email" : "Verify your Kitchen Email"}
          </h2>

          {showResend ? (
            <form onSubmit={handleResendEmail}>
              <div className="input-group">
                <label htmlFor="Email" style={{ fontFamily: "sans-serif" }}>
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  placeholder="Enter your email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="button-container">
                <button type="submit" className="submit-button">
                  Resend Email
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="Email" style={{ fontFamily: "sans-serif" }}>
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  placeholder="Enter your email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {showResend ? null : (
                <div className="input-group">
                  <label
                    htmlFor="EmailOTP"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    OTP
                  </label>
                  <input
                    type="number"
                    id="EmailOTP"
                    name="EmailOTP"
                    placeholder="Enter your OTP"
                    value={formData.EmailOTP}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              <div className="button-container">
                <button type="submit" className="submit-button">
                  {showResend ? "Resend Email" : "Verify"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Verifymail;
