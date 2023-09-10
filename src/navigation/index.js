import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignIn from '../MainCode/SignInScreen/SignIn';
import Signup from '../MainCode/SignUpScreen/Signup';
import Home from '../MainCode/HomeScreen/Home';
import Dashboard from '../MainCode/SideBarLinkPage/Dashboard';
import Order from '../MainCode/SideBarLinkPage/Order';
import Menus from '../MainCode/SideBarLinkPage/Menu';
import History from '../MainCode/SideBarLinkPage/OrderHistory';
import Reviews from '../MainCode/SideBarLinkPage/Reviews';

function Navigation() {
    return(
        <Router>
            <Routes>
                <Route path='/' element={<Signup />} />
                <Route path='/signIn' element={<SignIn />} />
                <Route path='/home' element={<Home />} />
                
                <Route path='/dashboard' element={<Dashboard/>} />
                <Route path='/menus' element={<Menus/>} />
                <Route path='/orders' element={<Order/>} />
                <Route path='/orderhistory' element={<History/>} />
                <Route path='/reviews' element={<Reviews />} />
            </Routes>
        </Router>
    )
}

export default Navigation;