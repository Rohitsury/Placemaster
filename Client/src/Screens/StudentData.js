import React, { useState, useEffect } from 'react'
import Sidebar from '../Component/Sidebar'
import { Link, NavLink } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import profileimg from '../assets/my-avatar.png'
import avatar from '../assets/profile.png'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloseIcon from '@mui/icons-material/Close';
import DashboardNavbar from '../Component/DashboardNavbar';

function StudentData() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [selectedbranch, setSelectedbranch] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [sortedFilteredStudents, setSortedFilteredStudents] = useState([]);
  const [profile, setProfile] = useState({});
  const [Open, setOpen] = useState(false);

 
  const fetchStudentData = async () => {
    try {
      const response = await fetch('http://localhost:5000/employee/studentData');
      const data = await response.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.log(err);
    }
  };


  const semesterOptions =
    selectedbranch === 'Master Of Computer Application' ||
      selectedbranch === 'MTech' ||
      selectedbranch === 'MBA'
      ? ['1', '2', '3', '4']
      : ['1', '2', '3', '4', '5', '6', '7', '8'];

  const close = () => {
    setOpen(false);
  };
  const departmentMapping = {
    'MCA': 'Master Of Computer Application',
    'CSE': 'Computer Science Engineering',
    'EE': 'Electrical and Electronics Engineering',
    'EC': 'Electrical and Communication Engineering ',
    'MBA': 'Master Of Business Administration',
  };
  const formateDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month}-${year}`;
  }
  const openResume = () => {
    const byteCharacters = atob(profile.resume);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    const resumeUrl = URL.createObjectURL(blob);

    window.open(resumeUrl, '_blank');
  };

  const filterStudents = () => {
    const standardBranch = departmentMapping[selectedbranch] || selectedbranch;
    const filteredData = students.filter((student) => {
      const hasSelectedbranch =
        standardBranch === 'all' || student.branch === standardBranch;
      const hasSelectedSemester =
        selectedSemester === 'all' || Number(student.sem) === Number(selectedSemester);

      if (!searchTerm && !cgpa) {
        return hasSelectedbranch && hasSelectedSemester;
      }
      const searchSkills = searchTerm.toLowerCase().split(', ');
      const hasSkills = searchSkills.every((usn) =>
        student.usn.toLowerCase().includes(usn)
      );
      const hasCGPA = cgpa ? student.cgpa >= parseFloat(cgpa) : true;
      return hasSelectedbranch && hasSkills && hasCGPA && hasSelectedSemester;
    });

    setFilteredStudents(filteredData);
  };

  const departmentPriority = {
    'Computer Science Engineering': 1,
    'Electrical and communication Engineering': 2,
    'Electrical and Electronics Engineering': 3,
    'MBA': 4,
    'Master Of Computer Application': 5,
    'MTech': 6,
  };

  const sortFilteredStudents = () => {
    const sortedData = [...filteredStudents];

    sortedData.sort((a, b) => {
      const priorityA = departmentPriority[a.branch] || 0;
      const priorityB = departmentPriority[b.branch] || 0;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      const usnA = parseInt(a.usn.substring(5), 10);
      const usnB = parseInt(b.usn.substring(5), 10);
      return usnA - usnB;
    });

    setSortedFilteredStudents(sortedData);
  };

  const renderStudentCards = () => {
    const departmentGroups = {};

    sortedFilteredStudents.forEach((student) => {
      const department = student.branch;
      if (!departmentGroups[department]) {
        departmentGroups[department] = [];
      }
      departmentGroups[department].push(student);
    });

    const openModal = (student) => {
      setProfile(student);
      setOpen(true);
    };



    const formateDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return `${day < 10 ? '0' + day : day}-${month}-${year}`;
    }

    const jsxElements = [];
    for (const department in departmentGroups) {
      jsxElements.push(
        <React.Fragment key={department}>
          <h3 className="mt-4 mb-2">{department}</h3>
          <div className="row mt-3 pe-2">
            {departmentGroups[department].map((student) => (
              <div key={student.usn} className="col-sm-3 mt-4" style={{ height: '55vh' }}>
                <div className="card shadow p-3" style={{ width: '18rem', border: 'none', borderRadius: '20px' }}>
                  <div className="student-card-inne-div" style={{ borderRadius: '20px' }}>
                    <div className="pt-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img
                        src={student.profileimg}
                        className="card-img-top"
                        alt="..."
                        style={{ height: '100px', width: '100px', borderRadius: '200px', objectFit: 'fill' }}
                      />
                    </div>
                    <div className="card-body text-center">
                      <h5 className="card-title" style={{ fontFamily: 'times-new-roman', fontStyle: 'italic' }}>
                        {student.name}
                      </h5>
                    </div>
                    <ul className="list-group list-group-flush student-card-data ">
                      <li className="list-group-item text-white" style={{ fontSize: '12px' }}>
                        USN : <span>{student.usn}</span>
                      </li>
                      <li className="list-group-item text-white" style={{ fontSize: '12px' }}>
                        Branch : <span>{student.branch}</span>
                      </li>
                      <li className="list-group-item text-white" style={{ fontSize: '12px' }}>
                        Sem : <span>{student.sem}</span>
                      </li>
                    </ul>
                    <div className="card-body">
                      <button to="#" className="card-link btn btn-primary" onClick={() => openModal(student)}>
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      );
    }

    return jsxElements;
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  
  useEffect(() => {
    filterStudents();
  }, [searchTerm, cgpa, selectedbranch, selectedSemester]);

  useEffect(() => {
    sortFilteredStudents();
  }, [filteredStudents]);
  return (
    <>
      <section>
        <div className="row">
          <Sidebar />
          <div className="col-lg-10 two">

            <DashboardNavbar/>

            <section className='mt-4 mb-4 text-white'>
              <div className='container'>
                <form id='search-form'  >
                  <label htmlFor='search-input' className='me-2 text-dark'>
                    Enter USN
                  </label>
                  <input
                    type='text'
                    id='search-input'
                    name='search'
                    placeholder='Enter search term...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <label htmlFor='category-select' className='me-2 ms-4 text-dark'>
                    Select Department
                  </label>
                  <select
                    id='category-select'
                    name='category'
                    value={selectedbranch}
                    onChange={(e) => setSelectedbranch(e.target.value)}
                  >
                    <option value='all'>All</option>
                    <option value='CSE'>CSE</option>
                    <option value='EE'>EE</option>
                    <option value='Electrical and communication Engineering'>EC</option>
                    <option value='Mechanical Engineer'>Mechanical Engineer</option>
                    <option value='MTech'>MTech</option>
                    <option value='MCA'>MCA</option>
                    <option value='MBA'>MBA</option>
                  </select>
                  <label htmlFor='semester-select' className='me-2 ms-4 text-dark'>
                    Select Semester
                  </label>
                  <select
                    id='semester-select'
                    name='sem'
                    value={selectedSemester}
                    onChange={(e) => {
                      const value = e.target.value === 'all' ? 'all' : Number(e.target.value).toString();
                      setSelectedSemester(value);
                    }}
                  >
                    <option value='all'>All</option>
                    {semesterOptions.map((sem) => (
                      <option key={sem} value={sem}>Sem {sem}</option>
                    ))}
                  </select>

                  <label htmlFor='cgpa-input' className='me-2 ms-4 text-dark'>
                    Enter CGPA
                  </label>
                  <input
                    type='text'
                    id='cgpa-input'
                    name='cgpa'
                    placeholder='Enter CGPA'
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                  />
                </form>
              </div>
            </section>

            {/* Company card */}
            <div className="row mt-3 pe-2">

              <div className="row mt-3 pe-2">
                {renderStudentCards()}
              </div>
            </div>
          </div>
        </div>
      </section>


      {Open && (
         <section className='separate-div h-100' style={{ backgroundColor: '#121212', color: 'white', height: '90.4vh' }}>
          <div className="container">
            <button className="close-btn my-2 my-sm-0 " onClick={close}  > <CloseIcon />  </button>
            <div className="row">
              <div className="col-3 shadow left mt-5 d-flex align-items-center" style={{ height: '80vh', backgroundColor: '#1e1e1f' }}>
                <div className="profileimg mt-4 d-flex justify-content-center align-items-center" style={{ width: '7.5rem', height: '7.5rem', backgroundColor: '#1e1e1f' }}>
                  {profile.profileimg ? (
                    <img src={profile.profileimg} className='shadow' alt="" style={{ width: '6.5rem', height: '6.5rem', borderRadius: '60px' }} />
                  ) : (
                    <img src={profileimg} alt="" style={{ width: '10rem', height: '10rem' }} />
                  )}
                </div>
                <div className="name">
                  <h6 style={{ color: '#FCFCFC' }}>{profile.name}</h6>
                  <div className="badge p-2" style={{ backgroundColor: '#383838', fontWeight: 'lighter', borderRadius: '7px', }}>{profile.branch}</div>
                  <br />
                  <span>
                    <div className=" mt-2 me-1 fw-bold badge" style={{ backgroundColor: '#383838', fontSize: '11px', color: '', fontWeight: 'lighter', borderRadius: '7px' }}>
                      Sem : {profile.sem}</div>
                    <div className=" mt-2 fw-bold badge" style={{ backgroundColor: '#383838', fontSize: '11px', color: '', fontWeight: 'lighter', borderRadius: '7px' }}>
                      USN : {profile.usn}</div>

                  </span>
                  <hr className="mt-4" style={{ border: 'none', borderBottom: '1.5px solid yellow' }} />
                </div>
                <ul className=' me-auto text-white' style={{ listStyleType: 'none' }}>
                  <div className="row">
                    <div className="col-3">
                      <li className=' p-2 d-flex justify-content-center icon-list'><EmailOutlinedIcon className='icons' />

                      </li>
                      <li className='p-2 d-flex justify-content-center mt-4 icon-list   '><PhoneAndroidOutlinedIcon className='icons' /></li>
                      <li className=' p-2 d-flex justify-content-center mt-4 icon-list'><CalendarMonthOutlinedIcon className='icons' /></li>
                      <li className=' p-2 d-flex justify-content-center mt-4 icon-list'><LocationOnOutlinedIcon className='icons' /></li>
                    </div>
                    <div className="col-8">
                      <div className=" " style={{ height: '5.3vh', }}>
                        <p className='mb-auto info' style={{ position: 'absolute' }} >EMAIL</p>
                        <h6 className='info-value' style={{ wordBreak: 'break-word' }}> <br />
                          {profile.email}
                        </h6>
                      </div>
                      <div className=" " style={{ height: '5.3vh', marginTop: '32px' }}>
                        <p className='mb-auto info' style={{ position: 'absolute' }}>PHONE</p>
                        <h6 className=' info-value'> <br />{profile.phone}</h6>
                      </div>
                      <div className=" mt-4" style={{ height: '5.3vh' }}>
                        <p className='mb-auto info' style={{ position: 'absolute' }}>DATE OF BIRTH</p>
                        <h6 className=' info-value'> <br />{formateDate(profile.dob)}</h6>
                      </div>
                      <div className=" mt-4 " style={{ height: '5.3vh' }}>
                        <p className='mb-auto info' style={{ position: 'absolute' }}>ADDRESS</p>
                        <h6 className=' info-value'> <br />{profile.address}</h6>
                      </div>
                    </div>
                  </div>
                </ul>
              </div>
              <div className="col-8 shadow ms-5 right mt-5" style={{ height: '80vh', backgroundColor: '#1e1e1f', width: '71.3%' }}>


                {/* Skills */}
                <div className='skills text-white'>
                  <h2 className='fw-bold mt-4 ms-3'>About </h2>
                  <hr className='ms-3' style={{
                    width: '5%', height: '.3rem', borderRadius: '10px', backgroundColor: '#FFDB6E',

                  }} />
                  <div className="row">
                    <div className='col-6'>
                      <div className='skill-subdiv mt-4 ms-3 ' >
                        <div className="d-flex ">
                          <span className='p-2 d-flex align-items-center justify-content-center icon-list'><BookmarksOutlinedIcon className=' icons' /></span>
                          <h5 className='fw-bold ms-3 text-secondary mt-2' style={{ letterSpacing: '1px', fontStyle: 'italic', fontFamily: 'times-new-roman' }}>
                            Skills</h5>
                        </div>
                        <h6 className='data' style={{ marginLeft: '3.7rem' }}>{profile.skills}</h6>
                      </div>
                      <div className='skill-subdiv mt-5 ms-3 ' >
                        <div className="d-flex ">
                          <span className='p-2 d-flex align-items-center justify-content-center icon-list'><AcUnitIcon className=' icons' />

                          </span>
                          <h5 className='fw-bold ms-3 text-secondary mt-2' style={{ letterSpacing: '1px', fontStyle: 'italic', fontFamily: 'times-new-roman' }}>
                            Hobbies</h5>
                        </div>
                        <h6 className='data' style={{ marginLeft: '3.7rem' }}>{profile.hobbies}</h6>
                      </div>
                      <div className='skill-subdiv mt-5 ms-3 ' >
                        <div className="d-flex ">
                          <span className='p-2 d-flex align-items-center justify-content-center icon-list'><AcUnitIcon className=' icons' />

                          </span>
                          <h5 className='fw-bold ms-3 text-secondary mt-2' style={{ letterSpacing: '1px', fontStyle: 'italic', fontFamily: 'times-new-roman' }}>
                            Languages Known</h5>
                        </div>
                        <h6 className='data' style={{ marginLeft: '3.7rem' }}>{profile.languagesknown}</h6>
                      </div>
                      <div className='skill-subdiv mt-5 ms-3 ' >

                        {profile.resume && (
                          <div className="resume-container">
                            <button className='btn viewresumebtn shadow text-white mt-5' style={{ backgroundColor: 'black' }} onClick={openResume}>View Resume</button>
                          </div>
                        )}
                      </div>

                    </div>
                    <div className='col-5'>
                      <div className='skill-subdiv mt-3 ms-3 ' >
                        <div className="d-flex ">
                          <span className='p-2 d-flex align-items-center justify-content-center icon-list'><AcUnitIcon className=' icons' />

                          </span>
                          <h5 className='fw-bold ms-3 text-secondary mt-2' id='#project' style={{ letterSpacing: '1px', fontStyle: 'italic', fontFamily: 'times-new-roman' }}>
                            Projects</h5>
                        </div>

                        <div className="project">
                          {profile.projects.map((project, index) => (
                            <div className="d-flex mt-3" style={{ marginLeft: '1rem' }} key={project.id}>
                              <div className="me-3 mt-2 dot-container">
                                <h6 scope="row" className="dot"></h6>
                                {index < profile.projects.length - 1 && <div className="line"></div>}
                              </div>
                              <div className="mt-2">
                                <h6 className='data' style={{ fontStyle: 'italic' }}>
                                  <span className="text-secondary">Year: </span>
                                  {project.year}
                                </h6>
                                <h6 className='data'>
                                  <span className="text-secondary" style={{ fontStyle: 'italic' }}>
                                    Title:
                                  </span>
                                  {project.title}
                                </h6>
                                <h6 className='data'>
                                  <span className="text-secondary" style={{ fontStyle: 'italic' }}>
                                    Technology:
                                  </span>
                                  {project.technology}
                                </h6>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )};
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
                    .company-btn {
                        // background-image: linear-gradient(310deg,#7928ca,#ff0080);
                        // background-color:white;
                        // color:white ; 
                        border-radius:10px;
                        box-shadow: 0 1px 12px rgba(0, 0, 0, 0.15) !important;
                        font-family:times-new-roman;
                    }
                    .company-btn:hover{
                        color:white;
                        box-shadow:0px 0px 15px 0px rgba(0,0,0,.15)
                    }
                    .btn.active{
                        color:white;
                        background-image: linear-gradient(310deg,#7928ca,#ff0080);
                        border:none;
                    }
                    .student-card-inne-div ,li{
                      background-image: linear-gradient(310deg,#141727,#3a416f);
                      color:white;
                    }
                    .dropdown-item{
                      color:white;
                    }
                    .separate-div {
                      position: fixed;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      background-color:rgba(0,0,0,0.6);
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

                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&family=Raleway:wght@600&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Poppins:wght@500;600&family=Raleway:wght@600&display=swap');
                      .left, .right {
                        border-radius: 30px;
                        flex-direction: column;
                        
                      }
                      
                      .profileimg {
                        border-radius: 60px;
                      }
                      
                      .name {
                        margin-top: 1rem;  
                        color:white;
                        font-family: 'Merriweather', serif;
                        text-align: center;  
                      }
                      .name h6{
                        font-size:20px;
                      }
                      .icons{
                        color:#FFDB6E;
                        font-weight:lighter;
                        
                      }
                      .icon-list{
                        background: radial-gradient(circle at 10% 20%, rgb(69, 86, 102) 0%, rgb(30, 30, 30) 60%);
                        border-radius:10px;
                        border-top:solid 2px #FFDB6E;
                        border-left:solid 2px #FFDB6E;
                        box-shadow:0 8px 16px 0 rgba(0,0,0,.5);
                      }
                      .skill-icon{
                        background: radial-gradient(circle at 10% 20%, rgb(69, 86, 102) 0%, rgb(30, 30, 30) 60%);
                      }
                      .info{
                        font-size:12px;
                        color:gray;
                      }
                      .info-value{
                        font-size:14px;
                        
                      } 
                      .box{
                        border-top-right-radius:30px;
                        border-bottom-left-radius:30px;
                        background-color: #383838;
                      }
                    
                      .project {
                        height: 250px;
                        
                      }
                      .data{
                        font-style:italic;
                        font-family:times-new-roman;
                      }
                      .dot-container {
                        position: relative;
                      }
                      .dot {
                        position: relative;
                        display: inline-block;
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        background: #FFDB6E;
                        text-align: center;
                        font-weight: bold;
                        line-height: 24px;
                      }
                      .line {
                        position: absolute;
                        top: 73%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 2px;
                        height: 108%;
                        background-color: #383838;
                      }
                    
                      .project {
                        height: 250px;
                        overflow-y: auto;
                      }
   
                `}
      </style>
    </>
  )
}

export default StudentData

