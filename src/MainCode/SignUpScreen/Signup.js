import React, { useState, useEffect } from 'react';
import './signup.css';
import { Link } from 'react-router-dom';
import {SignUp, GetBank, ValidateBank} from '../Features/KitchenSlice'
import { Select, Modal, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [bankNames, setBankNames] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    KitchenName: '',
    KitchenEmail: '',
    ManagerFirstName: '',
    ManagerLastName: '',
    ManagerPhone: '',
    ManagerEmail: '',
    Password: '',
    University: '',
    AccountNumber: '',
    AccountName: '',
    BankCode: '',
    BankName: '',
  });

  const handleTabChange = (tabNumber) => {
    if (tabNumber === activeTab + 1) {
      if (isFormValid(activeTab)) {
        setActiveTab(tabNumber);
      }
    } else if (tabNumber === activeTab - 1) {
      setActiveTab(tabNumber);
    }
  };

  const [isVerifyingBank, setIsVerifyingBank] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVerifyBankDetails = async () => {
    if (!isVerifyingBank) {
      setIsVerifyingBank(true);
      const payload = {
        ...formData,
        ShouldProceed: false,
      };
      console.log('ShouldProceedFalse ' ,payload)
      try {
        const response = await ValidateBank(payload);
        if (response.status === true) {
          const accountName = response.data.account_name;
          setFormData({ ...formData, AccountName: accountName });
          setIsModalVisible(true);
        } else if (response.message === "Could not verify account, kindly check if your account number is correct") {
          notification.error({
            message: 'Bank Account Verification Failed',
            description: 'The bank account details could not be verified. Please double-check your bank account details.',
          });
        } else {
          notification.error({
            message: 'Bank Account Verification Failed',
          });
        }
      } catch (error) {
        console.error(error);
        notification.error({
          message: 'Bank Account Verification Failed',
          description: 'An error occurred while verifying your bank account. Please try again.',
        });
      } finally {
        setIsVerifyingBank(false);
      }
    }
  };


  const handleNext = () => {
    if (activeTab < 3) {
      if (isFormValid(activeTab)) {
        setActiveTab(activeTab + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (activeTab > 1) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData
    }
    try {
      const response = await SignUp(payload);
      console.log(response)
      if (response.code === 200) {
        notification.success({
          message: 'Sign Up Successful',
          description: 'Please check your email for the confirmation code.',
        });
        navigate('/verifyEmail');
      } else {
        notification.error({
          message: 'Sign Up Failed',
          description: 'An error occurred during sign-up. Please try again.',
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Sign Up Failed',
        description: 'An unexpected error occurred during sign-up. Please try again.',
      });
    }
    console.log(formData);
  };  

  const isFormValid = (tab) => {
    switch (tab) {
      case 1:
        // Validate the fields for the first tab
        return(
          formData.KitchenName.trim() !== '' &&
          formData.KitchenEmail.trim() !== '' &&
          formData.University.trim() !== ''
        ) 
      case 2:
        // Validate the fields for the second tab
        return (
          formData.ManagerFirstName.trim() !== '' &&
          formData.ManagerLastName.trim() !== '' &&
          formData.ManagerEmail.trim() !== '' &&
          formData.ManagerPhone.trim() !== '' &&
          formData.Password.trim() !== ''
        );
      case 3:
        // Validate the fields for the third tab
        return formData.AccountNumber.trim() !== '';
      default:
        return false;
    }
  };

  useEffect(() => {
    fetchBankNames();
  }, []);

  const fetchBankNames = async () => {
    try {
      const bankData = await GetBank();
      setBankNames(bankData.data);
    } catch (error) {
      console.error(error);
    }
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBankVerified, setIsBankVerified] = useState(false);
  const handleConfirmation = async () => {
    setIsModalVisible(false);
    setIsVerifyingBank(true);

    const payload = {
      ...formData,
      ShouldProceed: true,
    };
    console.log('ShouldProceedTrue ' ,payload)
    try {
      const response = await ValidateBank(payload);
      console.log(response);
      if (response.message === "Transfer recipient created successfully") {
        setIsBankVerified(true);
        notification.success({
          message: 'Bank Account Verification Completed',
          description: 'Your bank account has been verified successfully.',
        });
      } else if (response.message === "Could not verify account, kindly check if your account number is correct") {
        notification.error({
          message: 'Bank Account Verification Failed',
          description: 'The bank account details could not be verified. Please double-check your bank account details.',
        });
      } else {
        notification.error({
          message: 'Bank Account Verification Failed',
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Bank Account Verification Failed',
        description: 'An error occurred while verifying your bank account. Please try again.',
      });
    } finally {
      setIsVerifyingBank(false);
    }
  };

  
  
  return (
    <div className="glass-morphism">
      <div className='fixed-header'>
        <h1 className='title' onClick={() => window.location.reload()}>QuicKee</h1>
        <Link to="/signIn" className='sign-in-button'>Sign In</Link>
      </div>
      <div className="rectangle">
        <div className="tab-header">
          <button
            className={activeTab === 1 ? 'active' : ''}
            onClick={() => handleTabChange(1)}
            style={{ filter: activeTab !== 1 ? 'blur(3px)' : 'none' }}
          >
            Kitchen Registration
          </button>
          <button
            className={activeTab === 2 ? 'active' : ''}
            onClick={() => handleTabChange(2)}
            style={{ filter: activeTab !== 2 ? 'blur(3px)' : 'none' }}
          >
            Manager Registration
          </button>
          <button
            className={activeTab === 3 ? 'active' : ''}
            onClick={() => handleTabChange(3)}
            style={{ filter: activeTab !== 3 ? 'blur(3px)' : 'none' }}
          >
            Verify Bank Details
          </button>
        </div>
        {activeTab === 1 && (
          <div>
            <h2 style={{ textAlign: 'center', marginTop: '0%' }}> Register Your Kitchen</h2>
            <div className="input-group">
              <label htmlFor="KitchenName">Kitchen Name</label>
              <input
                type="text"
                id="KitchenName"
                name="KitchenName"
                placeholder="What is your Kitchen's Name?"
                value={formData.KitchenName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="KitchenEmail">Kitchen Email</label>
              <input
                type="email"
                id="KitchenEmail"
                name="KitchenEmail"
                placeholder="What is your Kitchen's Email"
                value={formData.KitchenEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="University">Kitchen Location</label>
              <input
                type="text"
                id="University"
                name="University"
                placeholder="What is your Kitchen's Located at?"
                value={formData.University}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <h2 style={{ textAlign: 'center', marginTop: '0%' }}>Manager Registration</h2>
            <div className="manager-registration">
              <div className="input-group">
                <label htmlFor="ManagerFirstName">First Name</label>
                <input
                  type="text"
                  id="ManagerFirstName"
                  name="ManagerFirstName"
                  placeholder="First Name"
                  value={formData.ManagerFirstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="ManagerLastName">Last Name</label>
                <input
                  type="text"
                  id="ManagerLastName"
                  name="ManagerLastName"
                  placeholder="Last Name"
                  value={formData.ManagerLastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="ManagerEmail">Email</label>
                <input
                  type="text"
                  id="ManagerEmail"
                  name="ManagerEmail"
                  placeholder="Email"
                  value={formData.ManagerEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="ManagerPhone">Mobile Number</label>
                <input
                  type="number"
                  id="ManagerPhone"
                  name="ManagerPhone"
                  placeholder="Mobile Number"
                  value={formData.ManagerPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="Password">Password</label>
                <input
                  type="password"
                  id="Password"
                  name="Password"
                  placeholder="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <h2 style={{ textAlign: 'center', marginTop: '0%' }}>Verify Bank Details</h2>
            <div className="input-group" style={{ marginBottom: '3%' }}>
              <label htmlFor="BankName">Kitchen Bank Name</label>
              <Select
                style={{ width: '75%', marginTop: '1%', height: '40%' }}
                onChange={(value, option) => {
                  const selectedBank = bankNames.find((bank) => bank.name === value);

                  if (selectedBank) {
                    setFormData({ ...formData, BankName: value, BankCode: selectedBank.code });
                  }
                }}
              >
                {bankNames.map((bank) => {
                  return (
                    <Select.Option key={bank.id} value={bank.name}>
                      {bank.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
            <div className="input-group">
              <label htmlFor="AccountNumber">Kitchen Account Number</label>
              <input
                type="number"
                id="AccountNumber"
                name="AccountNumber"
                placeholder="Input your Account Number"
                value={formData.AccountNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyBankDetails}
              style={{ marginLeft: '7%' }}
              disabled={isVerifyingBank || !isFormValid(activeTab)}
            >
              {isVerifyingBank ? 'Verifying Bank Details...' : 'Verify Bank Details'}
            </button>
          </div>
        )}
          <Modal
            title="Bank Account Verification"
            open={isModalVisible}
            onOk={handleConfirmation}
            onCancel={() => setIsModalVisible(false)}
          >
            <p>Please confirm that "{formData.AccountName}" is the name associated with your bank account.</p>
          </Modal>
        <div className="button-container" style={{ background: 'transparent' }}>
          {activeTab !== 1 && (
            <button type="button" onClick={handlePrevious} className="previous-button">
              Previous
            </button>
          )}
          {activeTab !== 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="next-button"
              disabled={!isFormValid(activeTab)} // Add this to disable button if form is not valid
            >
              Next
            </button>
          ) : (
            <button 
            type="submit" 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={!isBankVerified}
            style={{backgroundColor: isBankVerified ? 'green' : 'grey'}}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
