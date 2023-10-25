import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from '../Component/Navbar';

function Drives() {

    const [compdata, setCompdata] = useState([]);
    const [search, setSearch] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [Open, setOpen] = useState(false);
    const [update, setUpdate] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState({});
    const [updatedCompany, setUpdatedCompany] = useState({});

    const getData = async () => {
        try {
            const res = await fetch('http://localhost:5000/admin/companies', {
                method: 'GET',
            });
            const data = await res.json();
            setSearch(data);
            setCompdata(data);

        } catch (err) {
            console.log(err);
        }
    };

    // const handleSearch = (e) => {
    //     const keyword = e.target.value.toLowerCase();
    //     const filteredData = compdata.filter((item) =>
    //         item.companyname.toLowerCase().includes(keyword)
    //     );
    //     setSearch(filteredData);
    // };

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredData = compdata.filter((item) =>
            item.companyname.toLowerCase().includes(keyword)
        );
    
        if (activeFilter === 'upcoming') {
            const currentDate = new Date().setHours(0, 0, 0, 0);
            const filteredUpcomingData = filteredData.filter((item) => {
                const driveDate = new Date(item.drivedate).setHours(0, 0, 0, 0);
                return driveDate >= currentDate;
            });
            setSearch(filteredUpcomingData);
        } else if (activeFilter === 'past') {
            const currentDate = new Date().setHours(0, 0, 0, 0);
            const filteredPastData = filteredData.filter((item) => {
                const driveDate = new Date(item.drivedate).setHours(0, 0, 0, 0);
                return driveDate < currentDate;
            });
            setSearch(filteredPastData);
        } else {
            setSearch(filteredData);
        }
    };
    

    const handleFilter = (filter) => {
        let filteredData = [];
        if (filter === 'upcoming') {
            filteredData = compdata.filter((item) => {
                const currentDate = new Date().setHours(0, 0, 0, 0);
                const driveDate = new Date(item.drivedate).setHours(0, 0, 0, 0);
                return driveDate >= currentDate;
            });
        } else if (filter === 'past') {
            filteredData = compdata.filter((item) => {
                const currentDate = new Date().setHours(0, 0, 0, 0);
                const driveDate = new Date(item.drivedate).setHours(0, 0, 0, 0);
                return driveDate < currentDate;
            });
        } else {
            filteredData = compdata;
        }

        setActiveFilter(filter);
        setSearch(filteredData);
    };

    const openModal = (company) => {
        setSelectedCompany(company);
        setOpen(true);
    };


    const close = () => {
        setOpen(false);
        setUpdate(false);
    };
    const formateDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month}-${year}`;
    }


    useEffect(() => {
        getData();

    }, []);

    return (
        <>
            <Navbar />
            <section className={Open ? 'fixed' : ''} style={{ backgroundColor: '', color: 'white', height: 'auto' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 mt-3">
                            <nav className="navbar navbar-expand-lg " style={{ backgroundColor: 'transparent' }}>
                                <div className="container">
                                <div>
                                <NavLink
                                    // className="btn company-btn me-4"
                                    className={`btn me-4 shadow ${activeFilter === 'all' ? 'actives' : 'btn-white notactive'}`}
                                    onClick={() => handleFilter('all')} style={{border:'none'}}
                                >
                                    All
                                </NavLink>

                                <NavLink
                                    onClick={() => handleFilter('upcoming')} style={{border:'none'}}
                                    className={`btn  me-4 shadow  ${activeFilter === 'upcoming' ? 'actives' : 'text-dark notactive'}`}
                                >
                                    Upcoming
                                </NavLink>

                                <NavLink
                                    // className="btn company-btn"
                                    onClick={() => handleFilter('past')} style={{border:'none'}}
                                    className={`btn me-4 shadow text-white ${activeFilter === 'past' ? 'actives' : 'btn-white notactive'}`}
                                >
                                    Past
                                </NavLink>
                            </div>
                                    <form className="d-flex ms-auto">
                                        <input
                                            className="form-control search-input"
                                            type="search"
                                            placeholder="Search Company"
                                            aria-label="Search"
                                            value={search.companyname}
                                            onChange={handleSearch}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                        <button className="btn search" type="submit">
                                            <SearchIcon />
                                        </button>
                                    </form>
                                </div>
                            </nav>
                        </div>

                    </div>
                    <div className="row mt-3">
                        {search.sort((a, b) => {
                                const dateA = new Date(a.drivedate);
                                const dateB = new Date(b.drivedate);
                                if (dateA < new Date() && dateB >= new Date()) {
                                    return 1; // 'Done' comes after 'Upcoming'
                                }
                                if (dateA >= new Date() && dateB < new Date()) {
                                    return -1; // 'Upcoming' comes before 'Done'
                                }
                                return dateA - dateB; // Sort by date for same status
                            }).map((item, index) => (
                            <div className="col-lg-3 col-sm-12 col-md-6 justify-content-center align-items-center d-flex mb-4" key={index}>
                                <div className="card shadow bg-dark " style={{ width: "80%"  ,border: 'none', borderRadius: '20px' }}>
                                    <img src={item.compimg} className="card-img-top" alt="..." style={{ height: '100px', borderTopRightRadius: '20px',borderTopLeftRadius: '20px', objectFit: 'fill' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.companyname}</h5>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item bg-dark text-white">
                                            Drive Date : <span>{new Date(item.drivedate).toLocaleDateString()}</span>
                                        </li>
                                        <li className="list-group-item bg-dark text-white">
                                            CTC : <span>{item.ctc}</span>
                                        </li>
                                        <li className="list-group-item bg-dark text-white">
                                            Branches:
                                            {item.branch}
                                        </li>
                                    </ul>
                                    <div className="card-body">
                                        <button className="card-link btn btn-primary" onClick={() => openModal(item)}>
                                            View
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                         
                    </div>
                </div >
            </section >

            {
                Open && (
                    <div className={`separate-div ${Open ? 'open' : ''}`} >
                        <div className="separate-div-content" style={{ width: "80%", height: "80%" }}>
                            <nav class="navbar  justify-content-between">
                                <h2 class="fw-bold" style={{ color: "#ff0080" }}>{selectedCompany.companyname}</h2>

                                <button className="close-btn my-2 my-sm-0 " onClick={close}> <CloseIcon />  </button>
                            </nav>
                            <div className="row" style={{ fontFamily: "Times-new-roman" }}>
                                <div className="col-12">
                                    <p><i>{selectedCompany.description}</i></p> <hr />
                                </div>
                                <div className="col-4 mt-3">
                                    <h5><strong>Job Role :</strong> {selectedCompany.jobrole}</h5>
                                </div>
                                <div className="col-4 mt-3">
                                    <h5>Job Location : {selectedCompany.joblocation}</h5>
                                </div>
                                <div className="col-4 mt-3">
                                    <h5>Package : {selectedCompany.ctc}</h5>
                                </div>
                                <hr />
                                <div className="col-4 mt-3">
                                    <h5>Eligibility Criteria : {selectedCompany.eligibility}</h5>
                                </div>
                                <div className="col-4 mt-3">
                                    <h5>Pass Year : {selectedCompany.passyear}</h5>

                                </div>
                                <div className="col-4 mt-3">
                                    <h5>Branches : {selectedCompany.branch}</h5>
                                </div>
                                <hr />
                                <div className="col-6 mt-3">
                                    <h5>Last Register Date : {formateDate(selectedCompany.registerbefore)}</h5>
                                </div>
                                <div className="col-6 mt-3">
                                    <h5>Drive Date : {formateDate(selectedCompany.drivedate)}</h5>
                                </div>
                                <hr />
                                <div className="col-12 mt-3">
                                    <h5>Registration Link : <a href={selectedCompany.reglink} target='_blank'> {selectedCompany.reglink}</a></h5>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            };



            <style>
                {`
          @import url('https://fonts.googleapis.com/css?family=Sofia:400,500,600,700&display=swap');

         
          .search {
            margin-left: -45px;
            color: gray;
          }
          .search-input {
            border-radius: 10px;
            box-shadow: 0 0px 10px 0px rgba(0, 0, 0, 0.10);
          }
          .search-input::placeholder {
            color: gray;
            opacity: 0.8;
          }
          .search-input:focus {
            box-shadow: 0 0px 20px 0px rgba(0, 0, 0, 0.10);
            border: none;
          }
        //   .company-btn {
        //     border-radius: 10px;
        //     box-shadow: 0 1px 12px rgba(0, 0, 0, 0.15) !important;
        //     font-family: times-new-roman;
        //   }
        //   .company-btn:hover {
        //     color: white;
        //     box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
        //   }
        //   .btn.active {
        //     color: white;
        //     background-image: linear-gradient(310deg, #7928ca, #ff0080);
        //     border: none;
        //   }

          /* separate div */
          .separate-div {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color:rgba(0,0,0,.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fade-in 0.4s ease;
          }
          .separate-div.open {
            animation: zoom-in 0.4s ease;
          }

          @keyframes fade-in {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes zoom-in {
            0% {
              opacity: 0;
              transform: scale(0.6);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .separate-div-content {        
            padding: 20px;
            border-radius:10px;
            // background: white;
            position: absolute;
            background: black;
            color:white;
            box-shadow:0 0 15px 15px rgba(0,0,0,.8)
          }
       

          .close-btn {
            background-color: #ff0080;
            color: white;
            border: none;
            padding: 5px 8px;
            border-radius: 5px;
            cursor: pointer;
          }

          .fixed{
            position:fixed;
          }

        
          
          .effect1{
            border-radius:20px
          }
          h4{
            font-family:times-new-roman;
            margin-left:34%;
          }
          .inner-div{
            background-image: linear-gradient(310deg,#141727,#3a416f);
            color:white;
          }
          .actives{
            color:white!important;
            background-image: linear-gradient(310deg, #7928ca, #ff0080);
            border: none!important;
            font-weight:bold;
          }
          .notactive{
            color:black!important;
          }
        `}
            </style>
        </>
    );
}

export default Drives;


function converToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}