import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
function DashboardCompNavbar() {
    return (
        <>
            <nav class="navbar navbar-expand-lg   px-3" style={{ borderRadius: "" }}>
                <div class="container-fluid">
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="me-auto">
                            <h5 className='fw-bold placemaster font-effect-shadow-multiple'>PLACEMASTER</h5>

                        </div>

                        <form class="d-flex">
                            <input class="form-control search-input" type="search" placeholder="Search Company" aria-label="Search" />
                            <button class="btn search" type="submit"><SearchIcon /></button>
                        </form>
                        <NotificationsIcon className='mx-4' />
                    </div>
                </div>
            </nav>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css?family=Sofia:400,500,600,700&display=swap');

                .placemaster{
                    letter-spacing:1px;
                    font-family:Sofia
                }
                .search{
                    margin-left:-45px;
                    color:gray;
                    }
                    .search-input{
                        border-radius:10px;
                        box-shadow: 0 0px 10px 0px  rgba(0,0,0,.10);
                    }
                .search-input::placeholder{
                    color:gray;  
                    opacity:.8
                }
                .search-input:focus{
                    box-shadow: 0 0px 20px 0px  rgba(0,0,0,.10);
                    border:none
                }
                
                `}
            </style>
        </>
    )
}

export default DashboardCompNavbar