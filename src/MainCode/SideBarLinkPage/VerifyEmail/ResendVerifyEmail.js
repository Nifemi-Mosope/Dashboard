import React, { useState } from "react";
import "../../SignUpScreen/signup.css";
import { useNavigate } from "react-router-dom";
import { ResendVerifyEmail } from "../../../Features/Kitchen/KitchenSlice";
import { notification } from "antd";

function ResendCode() {
  const [formData, setFormData] = useState({
    Email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

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
        navigate("/verifyEmail");
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
            Resend Verify Email
          </h2>
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
                Resend Verify Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResendCode;
