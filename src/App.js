import React from 'react';
import { useRoutes } from 'react-router-dom';
import SignIn from './MainCode/SignInScreen/SignIn';
import Signup from './MainCode/SignUpScreen/Signup';
import Home from './MainCode/HomeScreen/Home';
import './index.css'

function App() {
  const routes = useRoutes([
    { path: '/', element: <Signup /> },
    { path: '/signIn', element: <SignIn /> },
    { path: '/home', element: <Home /> },
  ]);

  return (
    <div>
      {routes}
    </div>
  );
}

export default App;
