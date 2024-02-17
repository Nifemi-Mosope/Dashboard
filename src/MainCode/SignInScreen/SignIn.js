import React, { useState } from "react";
import "../SignUpScreen/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { Signin } from "../../Features/Kitchen/KitchenSlice";
import { notification } from "antd";
import { useMenuContext } from "../SideBarLinkPage/Menus/MenuContext";

function SignIn() {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const { setUser, setAuth, setRefreshToken } = useMenuContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      Email: formData.Email,
      Password: formData.Password,
    };
    try {
      const response = await Signin(payload);
      console.log(response);
      if (response.code === 200) {
        localStorage.setItem("userData", JSON.stringify(response.body));
        localStorage.setItem("auth", JSON.stringify(response.extrainfo));
        notification.success({
          message: "Login Successful",
          description:
            "Welcome back to QuicKee, your kitchen trusted companion. Were delighted to see you again. Thank you for choosing QuicKee, where your culinary journey begins!",
        });
        setUser(response.body);
        setAuth(response.extrainfo);
        setRefreshToken(response?.extrainfo?.refreshtoken);
        // console.log(response.body);
        navigate("/home");
      } else if (response.message === "Incorrect Password") {
        notification.error({
          message: "Incorrect Credential",
          description:
            "Incorrect Email or password. Check your login details again",
        });
      } else if (response.message === "User not found") {
        notification.error({
          message: "User not found",
          description:
            "This User is not found. Check your login credentials again",
        });
      } else if (response.message === "Unverified email") {
        notification.error({
          message: "Unverified Email",
          description: "This User is not yet verified",
        });
        navigate(`/verifyEmail?showResend=true&email=${formData.Email}`);
      }
    } catch (error) {
      // console.error(error);
      notification.error({
        message: "Sign Up Failed",
        description:
          "An unexpected error occurred during sign-up. Please try again.",
      });
    }
    // console.log(formData);
  };

  const handleGoToSignUp = () => {
    navigate("/");
  };

  return (
    <div className="glass-morphism">
      <div className="fixed-header">
        <h1 className="title" onClick={() => window.location.reload()}>
          QuicKee
        </h1>
        <button onClick={handleGoToSignUp} className="sign-in-button">
          SignUp
        </button>
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
            Login To Your Account
          </h2>
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
            <div className="input-group">
              <label htmlFor="Password" style={{ fontFamily: "sans-serif" }}>
                Password
              </label>
              <input
                type="password"
                id="Password"
                name="Password"
                placeholder="Enter your password"
                value={formData.Password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginLeft: "7%", fontFamily: "sans-serif" }}>
              <p>
                Forgot Password? <Link to="/forgotpassword">Click here</Link>
              </p>
            </div>
            <div className="button-container">
              <button type="submit" className="submit-button">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
