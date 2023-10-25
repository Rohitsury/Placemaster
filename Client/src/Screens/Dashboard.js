import React, { useEffect, useState } from 'react'
import './style/style.css'
import Sidebar from '../Component/Sidebar'
import DashboardNavbar from '../Component/DashboardNavbar'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import CelebrationIcon from '@mui/icons-material/Celebration';

function Dashboard() {

    const [compdata, setCompdata] = useState([,]);
    const [dataCount, setDataCount] = useState(0);
    const [upcoming, setUpcoming] = useState(0);
    const [past, setPast] = useState(0);
    const [placedstudents, setPlacedStudents] = useState([]);
    const [beCount, setBeCount] = useState(0);
    const [mcaCount, setMcaCount] = useState(0);
    const [mbaCount, setMbaCount] = useState(0);
    const [mtechCount, setMtechCount] = useState(0);
    const [currentPlacedStudentIndex, setCurrentPlacedStudentIndex] = useState(0);

    // Add more counts for other categories if needed

    const fetchStudentData = async () => {
        try {
            const response = await fetch('http://localhost:5000/admin/placedstudents');
            const data = await response.json();
            setPlacedStudents(data.results);
        } catch (err) {
            console.log(err);
        }
    };
    
    const getCompany = async () => {
        try {
            const res = await fetch('http://localhost:5000/admin/companies', {
                method: "GET",
            });
            const data = await res.json();

            setCompdata(data)
            const count = data.length;
            setDataCount(count)
        }
        catch (err) {
            console.log(err)
        }

    }

    const companies = () => {
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const ucount = compdata.filter((item) => {
            const driveDate = new Date(item.drivedate).setHours(0, 0, 0, 0);
            return driveDate >= currentDate;
        }).length;
        setUpcoming(ucount);

        const pcount = compdata.filter((item) => {
            const driveDate = new Date(item.drivedate).setHours(0, 0, 0, 0);
            return driveDate <= currentDate;
        }).length;
        setPast(pcount)
    }

    const formateDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month}-${year}`;
    }

    const getStudentData = async () => {
        try {
            const res = await fetch('http://localhost:5000/employee/studentData', {
                method: "GET",
            });

            const data = await res.json();
            // Count the documents based on USN prefix and update the corresponding counts
            const beEECount = data.filter(item => item.usn.toLowerCase().includes('ee')).length;
            const beCSECount = data.filter(item => item.usn.toLowerCase().includes('cse')).length;
            const beECCount = data.filter(item => item.usn.toLowerCase().includes('ec')).length;
            const beMECount = data.filter(item => item.usn.toLowerCase().includes('me')).length;
            const mcaCount = data.filter(item => item.usn.toLowerCase().includes('mca')).length;
            const MBACount = data.filter(item => item.usn.toLowerCase().includes('mba')).length;
            const mtechCount = data.filter(item => item.usn.toLowerCase().includes('mt')).length;

            let totalBECount = beEECount + beCSECount + beECCount + beMECount

            setBeCount(totalBECount);
            setMcaCount(mcaCount);
            setMbaCount(MBACount);
            setMtechCount(mtechCount);
        } catch (err) {
            console.log(err)
        }
    }
  
    useEffect(() => {
        fetchStudentData();
        companies();
        getCompany();
        getStudentData();
    })

     return (
        <>
            <div className="row ">
                <Sidebar />
                <div className="col-lg-10 two" >
                    <DashboardNavbar />

                    {/* cards */}
                    <div class="row mt-3 px-3   ">

                        <div class="col-sm-3">
                            <div class="card shadow" >
                                <div class="card-body fw-bold d-flex ">
                                    <div>

                                        <h5 class="card-title  fw-bold">BE</h5>
                                        <p class="card-text">{beCount}</p>
                                    </div>
                                    <div className='mx-5 mt-1'>
                                        <PersonRoundedIcon className='icons text-white shadow' style={{ marginLeft: "130px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="card  shadow">
                                <div class="card-body d-flex">
                                    <div>

                                        <h5 class="card-title   fw-bold">MTech</h5>
                                        <p class="card-text  fw-bold">{mtechCount}</p>
                                    </div>
                                    <div className='mx-5 mt-1'>
                                        <PersonRoundedIcon className='icons text-white shadow' style={{ marginLeft: "100px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="card  shadow">
                                <div class="card-body d-flex">
                                    <div>

                                        <h5 class="card-title   fw-bold">MCA</h5>
                                        <p class="card-text  fw-bold">{mcaCount}</p>
                                    </div>
                                    <div className='mx-5 mt-1'>
                                        <PersonRoundedIcon className='icons text-white shadow' style={{ marginLeft: "110px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="card  shadow">
                                <div class="card-body d-flex">
                                    <div>

                                        <h5 class="card-title   fw-bold">MBA</h5>
                                        <p class="card-text  fw-bold">{mbaCount}</p>
                                    </div>
                                    <div className='mx-5 mt-1'>
                                        <PersonRoundedIcon className='icons text-white shadow' style={{ marginLeft: "110px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Card End */}

                    {/* Company Card */}

                    <div className="row mt-4 px-3">
                        <div class="col-sm-6">
                            <div class="card shadow p-4" style={{ height: "220px" }}>
                                <div class="card-body company-card-body   fw-bold d-flex " style={{ height: "10px" }}>
                                    <div className='left' >
                                        <h2 class="card-title text-white fw-bold">Total Companies</h2>
                                        <h3 class="card-text text-white fw-bold">{compdata.length}</h3>
                                    </div>
                                    <div className='mx-5 mt-1'>
                                        <TrendingUpOutlinedIcon className='company-icons text-white shadow' style={{ marginLeft: "190px", marginTop: "5px", marginBottom: "30px" }} />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3 px-3">
                                <div className="caption-top" >
                                    <caption style={{ width: "250%", marginBottom: "-10px" }}>Drives Details</caption>
                                    <div class="table-container mt-3 ">

                                        <table className='border shadow'>

                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Company Name</th>
                                                    <th scope="col">Ctc</th>
                                                    <th scope="col">Drive Date</th>
                                                    <th scope="col">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {compdata.sort((a, b) => {
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
                                                    <tr key={item.id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.companyname}</td>
                                                        <td>{item.ctc}</td>
                                                        <td>{formateDate(item.drivedate)}</td>
                                                        <td className='text-success fw-bold'>
                                                            {
                                                                new Date(item.drivedate) < new Date() ? 'Done' : 'Upcoming'
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div class="card shadow p-3" >
                                        <div class="card-body Upcompany-card-body   fw-bold d-flex ">
                                            <div className='left'>
                                                <h6 class="card-title text-white  fw-bold" style={{ width: "200%" }}>Upcoming Companies</h6>
                                                <h6 class="card-text text-white fw-bold">{upcoming}</h6>
                                            </div>
                                            <div className='mx-5 mt-1'>
                                                <KeyboardDoubleArrowDownIcon className='icons text-white shadow' style={{ marginLeft: "50px" }} />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div class="card shadow p-3" >
                                        <div class="card-body Upcompany-card-body   fw-bold d-flex ">
                                            <div className='left'>
                                                <h6 class="card-title text-white  fw-bold" style={{ width: "200%" }}>Past Companies </h6>
                                                <h6 class="card-text text-white fw-bold">{past}</h6>
                                            </div>
                                            <div className='mx-5 mt-1'>
                                                <KeyboardDoubleArrowUpIcon className='icons text-white shadow' style={{ marginLeft: "50px" }} />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 mt-4">
                                    <div class="card shadow p-4" style={{ height: "220px" }}>
                                        <div class="card-body company-card-body   fw-bold d-flex " style={{ height: "10px" }}>
                                            <div className='left'>
                                                <h2 class="card-title text-white fw-bold">Placed Students</h2>
                                                <h3 class="card-text text-white fw-bold">{placedstudents.length}</h3>
                                            </div>
                                            <div className='mx-4 mt-1'>
                                                <CelebrationIcon className='company-icons text-white shadow' style={{ marginLeft: "190px", marginTop: "5px", marginBottom: "30px" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-12 mt-5">
                                    {/* Placed Student Name and company and ctc */}
                                    <div className="placed-student-container">
                                        <div className="vertical-scrolling">
                                            {placedstudents.map((student, index) => (
                                                <div key={index} className="placed-student">
                                                    <h5>
                                                    <span className="student-name mx-2 fw-bold">{student.studentname}</span>
                                                    <span className="student-company mx-2 fw-bold text-primary">{student.companyname}</span>
                                                    <span className="student-ctc fw-bold text-danger">{student.ctc}</span>
                                                    </h5>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* End Company Card */}

                    {/* Tables starts */}

                </div>


            </div>

            <style>
                {`
                .table-container {
                    height: 220px; /* Set the desired height for the table body */
                    overflow-y: scroll; /* Enable vertical scrolling */
                  }
                  
                  table {
                    width: 100%;
                    border-collapse: collapse;
                  }
                  
                  th, td {
                    padding: 8px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                    font-family:times-new-roman
                  }
                  
                  thead {
                    position: sticky;
                    top: 0;
                    background-image: linear-gradient(310deg,#141727,#3a416f);
                    color:white;
                  }

                   
                    .card{
                        background-color:rgba(255,255,255,0.99);
                        border-radius:20px;
                        border:none
                    }
                    .card-body{
                        font-family:time-new-roman;
                        // font-weight:bold;  
                    }
                    .card-body .left h2{
                        // font-weight:bold;
                        width:160%;

                    }
                    .icons
                    {
                        background-image: linear-gradient(310deg,#7928ca,#ff0080);
                        border-radius:10px;
                        padding:10px; 
                        font-size:50px
                    }
                    .company-icons{
                        background-image: linear-gradient(310deg,#7928ca,#ff0080);
                        border-radius:15px;
                        padding:10px; 
                        font-size:120px
                    }                 
                    .company-card-body{
                        border-radius:20px;
                        background-image: linear-gradient(310deg,#141727,#3a416f);
                    }
                    .Upcompany-card-body{
                        border-radius:20px;
                        background-image: linear-gradient(310deg,#141727,#3a416f);
                        height:90px
                    }


                    .placed-student-container {
                        height: 100px; /* Adjust the height as needed */
                        overflow: hidden;
                        position: relative;
                    }
                    
                    .vertical-scrolling {
                        animation: scrollUp 20s linear infinite; /* Adjust the animation speed and duration as needed */
                    }
                    
                    @keyframes scrollUp {
                        0% {
                            transform: translateY(0);
                        }
                        100% {
                            transform: translateY(-100%);
                        }
                    }
                    
                    .placed-student {
                        margin: 0;
                        font-size: 18px;
                        text-align: center;
                        padding: 10px;
                        border-bottom: 1px solid #ddd;
                        transform: translateY(100%);
                    }
                    
                   
               
            `}

            </style>
        </>
    )
}

export default Dashboard