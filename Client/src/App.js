import React, { useEffect } from 'react';
import AdminLogin from './Screens/AdminLogin';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Screens/Dashboard';
import CreateDrives from './Screens/CreateDrives';
import StudentData from './Screens/StudentData';
import ViewStudents from './Screens/ViewStudents';
import Companies from './Screens/Companies';
import PageNotFound from './Component/PageNotFound';
import ForgotPassword from './Component/ForgotPassword';
import AddPlacedStudent from './Screens/AddPlacedStudent';
import PlacedStudents from './Screens/PlacedStudents';
import UploadVideo from './Screens/UploadVideo';
import Video from './Screens/Video';
const App = () => {

  const isTokenValid = () => {
    const token = localStorage.getItem('jwttoken');
    return token !== null;
  };
  
  const ProtectedRoute = ({ element, path }) => {
    useEffect(() => {
      if (!isTokenValid()) {
        window.location.href = '/';  
      }
    }, []);
  
    return isTokenValid() ? element : <Navigate to="/" />;
  };
  return (
    <Router>
        <Routes>
          <Route path='/' element={<AdminLogin/>}></Route>
          <Route path='/forgotpassword' element={<ForgotPassword/>}></Route>
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/Addcompany" element={<ProtectedRoute element={<CreateDrives />} />} />
          <Route path="/Companies" element={<ProtectedRoute element={<Companies />} />} />
          <Route path="/Studentdata" element={<ProtectedRoute element={<StudentData />} />} />
          <Route path="/ViewStudents" element={<ProtectedRoute element={<ViewStudents />} />} />
          <Route path="/AddPlacedStudent" element={<ProtectedRoute element={<AddPlacedStudent />} />} />
          <Route path="/PlacedStudent" element={<ProtectedRoute element={<PlacedStudents />} />} />
          <Route path="/uploadvideo" element={<ProtectedRoute element={<UploadVideo />} />} />
          <Route path="/video" element={<ProtectedRoute element={<Video />} />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
  );
};

export default App;