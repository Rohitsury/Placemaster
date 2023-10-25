import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import usericon from '../assets/user-icon.png'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadIcon from '@mui/icons-material/Upload';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
function Navbar() {
  const [scroll, setScroll] = useState(false)
  const [profile, setProfile] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    usn: '',
    branch: '',
    sem: '',
    cgpa: '',
    skills: '',
    hobbies: '',
    languagesknown: '',
    projects: [{ year: '', title: '', technology: '' }],
    profileimg: '',
    resume: ''
  });
  
  const token = localStorage.getItem('jwttoken');
  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/student/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      
      if (response.ok) {
        if (data.profile) {
           
          setProfile(data.profile.name);
          console.log(profile)
          setFormData({
            name: data.profile.name,
            email: data.profile.email,
            phone: data.profile.phone,
            address: data.profile.address,
            dob: data.profile.dob,
            usn: data.profile.usn,
            branch: data.profile.branch,
            sem: data.profile.sem,
            cgpa: data.profile.cgpa,
            skills: data.profile.skills,
            hobbies: data.profile.hobbies,
            languagesknown: data.profile.languagesknown,
            projects: data.profile.projects,
            profileimg: data.profile.profileimg,
            resume: data.profile.resume
          });
          localStorage.setItem('profileData', JSON.stringify(data.profile));
        }
         
      } else {
        console.error('Error fetching profile:', data);
        
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
  let navigate = useNavigate();
  useEffect(() => {
    console.log(profile)
    console.log(formData)
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (window.pageYOffset > 0) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const handleLogout = () => {
    if (/* eslint-disable no-restricted-globals */ confirm("Are You Sure?") /* eslint-enable no-restricted-globals */) {
      localStorage.removeItem("jwttoken");
      localStorage.removeItem("userid");
      alert("Logged Out");
      navigate('/');
    } else {
      navigate('/');
    }


  }
  useEffect(() => {
    fetchProfile();
  }, [token]);

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-dark shadow ${scroll ? 'fixed-top' : ''}`} onScroll={handleScroll} style={{ backgroundColor: 'rgba(0,0,0,.9)' }}>
        <div className="container">
          <Link className="navbar-brand fs-3 fw-bold" style={{ fontFamily: 'sans-serif', letterSpacing: '1px' }}>PLACEMASTER</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse " id="navbarSupportedContent">
            <ul className="navbar-nav   ms-auto mb-2 mb-lg-0 ">
              <li className="nav-item">
                <NavLink className="nav-link text-white homelink  me-lg-4" activeClassName="active" style={{ letterSpacing: "1px" }} aria-current="page" exact to="/">Home</NavLink>
              </li>
              {
                (!localStorage.getItem("jwttoken")) ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="loginbtn btn me-lg-4" activeClassName="active" exact to="/login">Login</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="regbtn btn my-2 my-lg-0" activeClassName="active" exact to="/register">Register</NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link homelink text-white me-lg-4" activeClassName="active" style={{ letterSpacing: "1px" }} aria-current="page" exact to="/drives">Drives</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link homelink text-white me-lg-4" activeClassName="active" style={{ letterSpacing: "1px" }} aria-current="page" exact to="/videos">Videos</NavLink>
                    </li>

                    
                    <div className="dropdown">
                      <div className='dropdown-toggle' id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" type="button" >
                        <img className=" img-fluid" src={usericon} alt="" style={{ maxWidth: '41px' }} />
                        <ArrowDropDownOutlinedIcon className='text-primary' style={{ fontSize: '30px' }} />
                        <span className='fw-bold text-dark badge bg-white'>{profile}</span>
                      </div>
                      
                      <ul className="dropdown-menu dropmenu mt-3" aria-labelledby="dropdownMenuButton1">
                        
                            <li><NavLink className="dropdown-item submenu" to='/profile'><AccountCircleOutlinedIcon className='me-2' />Profile</NavLink></li>
                       

                        <li><NavLink className="dropdown-item submenu" to='/changepassword'> <SettingsOutlinedIcon className='me-2' />Change Password</NavLink></li>

                        <li><button className="dropdown-item submenu" onClick={handleLogout}> <LogoutIcon className='me-2' />Logout</button></li>
                      </ul>
                    </div>
                  </>
                )}


            </ul>
          </div>
        </div>
      </nav>
      <style>

        {`
                .navbar {
                    background-color: rgba(0, 0, 0, 0.85);
                }
                .loginbtn, .regbtn{
                  border-radius : 50px;
                  color:White;
                  padding:6px 25px;
                  border : 2px solid rgba(205, 164, 94, 0.983);
                  transition: .3s linear;
                  letter-spacing: 1px; 
                }
                 .nav-link{
                  font-size:17px;
                 }
                .nav-link:hover{
                  color:rgba(205, 164, 94, 0.983)!important;
                                    
                }
                .loginbtn:hover,.regbtn:hover{
                    box-shadow: 0 0 8px 0 rgba(255, 255, 255, 0.5);
                    color:white;
                    
                }

                .active{
                  color:rgba(255, 204, 100, 0.9)!important;
                } 
                .dropmenu{
                  // backdrop-filter: blur(16px) saturate(180%);
                  // -webkit-backdrop-filter: blur(16px) saturate(180%);
                  background-color:black;
                  margin-left:-150px!important;
                  box-shadow:0 10px 20px 0 rgba(0,0,0,.8);
                  height:30vh;
                  width:26vh;
                  
                } 
                .submenu{
                  margin-top:10px;
                  color:white;
                  
                }
              
            `}
      </style>


    </>
  )
}

export default Navbar