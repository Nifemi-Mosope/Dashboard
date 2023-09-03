import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignIn from '../MainCode/SignInScreen/SignIn';
import Signup from '../MainCode/SignUpScreen/Signup';

function Navigation() {
    return(
        <Router>
            <Routes>
                <Route path='/' element={<Signup />} />
                <Route path='/signIn' element={<SignIn />} />
            </Routes>
        </Router>
    )
}

export default Navigation;