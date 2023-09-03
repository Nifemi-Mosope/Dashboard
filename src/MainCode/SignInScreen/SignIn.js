import React, { useState } from 'react';
import '../SignUpScreen/signup.css';

function SignIn() {
  const [activeTab, setActiveTab] = useState(1);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const isFormValid = (tab) => {
    switch (tab) {
      case 1:
        // Validate the fields for the first tab
        return formData.KitchenName.trim() !== '' && formData.University.trim() !== '';
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

  return (
    <div
      className="glass-morphism"
      style={{
        backgroundColor: '#f2f2f2',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 20px',
        }}
      >
        <h1
          style={{
            color: '#c45628',
            fontSize: '48px',
            fontFamily: 'cursive',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            margin: '0',
            marginBottom: '45%',
            cursor: 'pointer',
          }}
        >
          QuicKee
        </h1>
        <button
          style={{marginBottom: '45%', cursor: 'pointer', height: '5%', width: '5%', borderRadius: '12%'}}
        >Sign In</button> {/* Moved to the far right */}
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
                placeholder="What is your Kitchen's Email(optional)?"
                value={formData.KitchenEmail}
                onChange={handleInputChange}
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
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <h2 style={{ textAlign: 'center', marginTop: '0%' }}>Verify Bank Details</h2>
            <div className="input-group">
              <label htmlFor="BankName">Kitchen Bank Name</label>
              <input
                type="text"
                id="BankName"
                name="BankName"
                placeholder="Input your Account Number"
                value={formData.BankName}
                onChange={handleInputChange}
              />
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
              />
            </div>
            <div className="input-group">
              <label htmlFor="AccountName">Kitchen Account Name</label>
              <input
                type="text"
                id="AccountName"
                name="AccountName"
                placeholder="Input your Account Number"
                value={formData.AccountName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
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
            <button type="submit" className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
