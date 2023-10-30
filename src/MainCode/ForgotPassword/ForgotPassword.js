import React, { useState } from 'react';
import '../SignUpScreen/signup.css';
import { useNavigate } from 'react-router-dom';
import { Forgotpassword } from '../Features/KitchenSlice';
import { notification } from 'antd';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    Email: '',
  });

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
  
    try {
      // Ensure that formData.Email is not undefined
      // if (!formData.Email) {
      //   notification.error({
      //     message: 'Invalid Email',
      //     description: 'Please enter a valid email address.',
      //   });
      //   return;
      // } 
      const payload = {
        Email: formData.Email,
      };
      const response = await Forgotpassword(payload);
      console.log(response);
      console.log(payload)
  
      if (response.code === 200) {
        notification.success({
          message: 'Email Sent',
          description: 'Email OTP has been resent. Check your email.',
        });
        navigate(`/resetPassword/${formData.Email}`);
      } else if (response.code === 400 && response.message === 'User not found') {
        notification.error({
          message: 'User Not Found',
          description: 'The provided email does not exist in our records.',
        });
      } else {
        notification.error({
          message: 'Resend Email Failed',
          description: 'An error occurred while resending the email.',
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Internal Server Error',
        description: 'An error occurred while processing your request.',
      });
    }
  };
  
  const handleSignInBack = () => {
    navigate('/signIn');
  }

  return (
    <div className="glass-morphism">
      <div className='fixed-header'>
        <h1 className='title' onClick={() => window.location.reload()}>QuicKee</h1>
        <button onClick={handleSignInBack} className='sign-in-button'>Back To SignIn</button>
      </div>
      <div className="rectangle">
        <div>
          <h2 style={{ textAlign: 'center', marginTop: '0%', fontFamily: 'sans-serif' }}>Forgot Passowrd</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="Email" style={{fontFamily: 'sans-serif'}}>Email</label>
              <input
                type='email'
                name="Email"
                placeholder="Enter your email"
                value={formData.Email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="button-container">
              <button type="submit" className="submit-button">
                Proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
