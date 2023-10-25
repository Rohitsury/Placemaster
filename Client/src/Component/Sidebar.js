import React from 'react'
import {NavLink, useNavigate  } from 'react-router-dom'
import '../Screens/style/style.css'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import CreateNewFolderRoundedIcon from '@mui/icons-material/CreateNewFolderRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CelebrationIcon from '@mui/icons-material/Celebration';
import UploadIcon from '@mui/icons-material/Upload';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

function Sidebar() {
    let navigate = useNavigate()
    const handleLogout = ()=>{
        localStorage.removeItem('jwttoken');
        navigate('/')
        window.location.reload()     
    }   
    return (
        <>
            <div className=" sidebar col-lg-2 " style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
                <div className='shadow admin'>
                    <div className="d-flex justify-content-center align-items-center mt-3">

                        <AdminPanelSettingsIcon className='admin-logo' />
                    </div>
                    <div className="d-flex justify-content-center align-items-center">

                        <h5 className='Admin-text'>Admin</h5>
                    </div>
                </div>

                <hr ></hr>
                <nav class="nav side-nav flex-column " id="nav">
                    <NavLink className="nav-link side-link " exact activeClassName="active" to="/dashboard"><GridViewRoundedIcon className='mx-2 side-icons' />Dashboard</NavLink>
                    <NavLink className="nav-link side-link " activeClassName="active" to="/Addcompany"><CreateNewFolderRoundedIcon className='mx-2 side-icons' />Create Drive</NavLink>
                    <NavLink className="nav-link side-link " activeClassName="active" to="/Companies"><CreateNewFolderRoundedIcon className='mx-2 side-icons' />Companies</NavLink>
                    <NavLink className="nav-link side-link " activeClassName="active" to="/Studentdata"><PeopleAltRoundedIcon className='mx-2 side-icons ' />Students</NavLink>
                    <NavLink className="nav-link side-link " activeClassName="active" to="/AddPlacedStudent"><PersonAddIcon className='mx-2 side-icons ' />Add Placed Stud</NavLink>
                    <NavLink className="nav-link side-link " activeClassName="active" to="/PlacedStudent"><CelebrationIcon className='mx-2 side-icons ' />Placed Student</NavLink>
                    <NavLink className="nav-link side-link " activeClassName="active" to="/uploadvideo"><UploadIcon className='mx-2 side-icons ' />Upload Video</NavLink>
                    <NavLink className="nav-link side-link " activeClassName="active" to="/video"><VideoLibraryIcon className='mx-2 side-icons ' />Videos</NavLink>
                    <NavLink className="nav-link side-link " activeClassName="active" onClick={handleLogout} to='/' > <LogoutIcon className='mx-2 side-icons' />Logout</NavLink>
            </nav>
        </div >
            <style>
                {`
                    .sidebar{
                        // box-shadow: 0 0px 15px 0px  rgba(0,0,0,.20);
                        border-right:1px solid rgba(0,0,0,.09);
                        position: fixed;
                        height: 100%;
                        padding: 10px;    
                    }
                    .admin{
                        width:90px;
                        margin-left:80px;
                        background-image: linear-gradient(310deg,#7928ca,#ff0080);
                        border-radius:20px;
                        
                    }
                    .admin-logo{
                        font-size:50px;
                        color:white
                        
                    }
                    .Admin-text{
                        font-family:times-new-roman;    
                        color:white;
                    }
                    hr{
                        margin-top:20px;
                    }
                    .side-nav{
                    }
                    .side-link{
                        color: black;
                        margin-top:20px;
                        border-radius:10px;
                        width:85%;
                        margin-left:30px;
                        
                    }
                    .nav-link:hover{
                        color: black;
                    }
                   .side-icons{
                    // background-image: linear-gradient(310deg,#7928ca,#ff0080);
                    background-image: white;
                    padding:5px;
                    font-size:30px;
                    color:black;
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
                    border-radius:6px;
                   }
                //    .nav-link.active .side-icons{
                //     background-image: linear-gradient(310deg,#7928ca,#ff0080);
                //     box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                //     color: white;
                    
                //   }
                //   .nav-link.active{
                //     box-shadow: 0 8rem 16px rgba(0, 0, 0, 0.15) ;
                //   }
                .nav-link.active {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                  }
                  
                  .nav-link.active .side-icons {
                    background-image: linear-gradient(310deg, #7928ca, #ff0080);
                    color: white;
                  }
                    `}

            </style>

        </>
    )
}

export default Sidebar