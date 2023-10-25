import './App.css';
import React, { useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Search from './Screens/Search';
import ForgotPassword from './Screens/ForgotPassword';
function App() {
  const isTokenValid = () => {
    const token = localStorage.getItem('jwttoken');
    return token !== null;
  };
  
  const ProtectedRoute = ({ element, path }) => {
    useEffect(() => {
      if (!isTokenValid()) {
        window.location.href = '/login';  
      }
    }, []);
  
    return isTokenValid() ? element : <Navigate to="/login" />;
  };
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path='/register' element={<Register/>}></Route>
          <Route path="/search" element={<ProtectedRoute element={<Search />} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
