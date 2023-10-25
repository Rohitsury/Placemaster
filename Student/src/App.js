import './App.css';
import React, { useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route,  Navigate, useNavigate} from 'react-router-dom';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Profile from './Screens/Profile';
import FetchProfile from './Screens/FetchProfile';
import ModifyProfile from './Screens/ModifyProfile';
import Drives from './Screens/Drives';
import ForgotPassword from './Screens/ForgotPassword';
import YourVieos from './Screens/YourVideos';
import Videos from './Screens/Videos';
import ChangePassword from './Screens/ChangePassword';
function App() {
  
  const isTokenValid = () => {
    const token = localStorage.getItem('jwttoken');
    return token !== null;
  };
  
  const ProtectedRoute = ({ element, path }) => {

    let navigate = useNavigate()
    useEffect(() => {
      if (!isTokenValid()) {
       navigate('/login')  
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
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/getprofile" element={<ProtectedRoute element={<FetchProfile />} />} />
          <Route path="/modifyprofile" element={<ProtectedRoute element={<ModifyProfile />} />} />
          <Route path="/drives" element={<ProtectedRoute element={<Drives />} />} />
          <Route path="/yourvideos" element={<ProtectedRoute element={<YourVieos />} />} />
          <Route path="/videos" element={<ProtectedRoute element={<Videos />} />} />
          <Route path="/changepassword" element={<ProtectedRoute element={<ChangePassword />} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
