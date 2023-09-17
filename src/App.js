import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './MainCode/SignInScreen/SignIn';
import Signup from './MainCode/SignUpScreen/Signup';
import Home from './MainCode/HomeScreen/Home';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/signIn' element={<SignIn />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;