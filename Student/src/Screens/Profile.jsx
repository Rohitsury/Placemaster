import React, { useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';
import profileimg from '../assets/my-avatar.png'
import avatar from '../assets/profile.png'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { NavLink, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import profilebgimg from '../assets/jh.jpg'
import 'aos/dist/aos.css';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";
import AOS from 'aos';

const Profile = () => {
  let navigate = useNavigate();
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
  const branchMapping = {
    CSE: 'Computer Science Engineering',
    EE: 'Electronics and Electricals',
    EC: 'Electronics and Communication',
    MTech: 'Master of Technology',
    MCA: 'Master Of Computer Application',
    MBA: 'Master Of Business Administration',
  };
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadings, setIsLoadings] = useState(true);
  
  const token = localStorage.getItem('jwttoken');


  const [imageUpload, setImageUpload] = useState(null);

  const imagesListRef = ref(storage, "Profileimges/");

  const uploadFile = async () => {

    if (imageUpload == null) return;
    const imageRef = ref(storage, `Profileimges/${Date.now() + imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  };

  const handleChange = (e, index) => {
    if (e.target.name === 'year' || e.target.name === 'title' || e.target.name === 'technology') {
      const projects = [...formData.projects];
      projects[index][e.target.name] = e.target.value;
      setFormData({ ...formData, projects });
    }
    else if (e.target.name === 'resume') {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleAddProject = () => {
    const projects = [...formData.projects];
    projects.push({ year: '', title: '', technology: '' });
    setFormData({ ...formData, projects });
  };

  const handleRemoveProject = (index) => {
    const projects = [...formData.projects];
    projects.splice(index, 1);
    setFormData({ ...formData, projects });
  };

  const createProfile = async () => {
    try {
      // Check if the branch starts with "BECSE" and use the corresponding long form
      // let longFormBranch = formData.branch;
      // if (formData.branch.startsWith('BECSE')) {
      //   longFormBranch = 'Computer Science Engineering';
      // } else if (branchMapping[formData.branch]) {
      //   longFormBranch = branchMapping[formData.branch];
      // }
      // setIsLoading(true);
      const regex = /^[A-Za-z\s\b]+$/
      if (!regex.test(formData.name)) {
        alert("Name field should Contains only Alphabets");
        return;
      }
      const numregex = /^[6-9]\d{0,9}$/;
      if (!numregex.test(formData.phone)) {
        alert("Invalid Phone number");
        return;
      }
      if (imageUpload) {
        const fileExtension = imageUpload.name.split('.').pop().toLowerCase();

        if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
          alert("Please select a valid video file (jpg, jpeg, png).");
          return;
        }
      }
      const url = imageUpload ? await uploadFile() : null; 
      const response = await fetch('http://localhost:5000/student/createprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, profileimg: url || '' }), // Use the long form branch in the request body
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        alert('Profile created successfully');
        window.location.reload();
      } else {
        alert('Error creating profile');
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    createProfile();

  };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await converToBase64(file);
  //   setFormData({ ...formData, profileimg: base64 });
  // };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase642(file);
    setFormData({ ...formData, resume: base64 });
  };

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
          setProfile(data.profile);
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
        setIsLoading(false);
      } else {
        console.error('Error fetching profile:', data);
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const formateDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month}-${year}`;
  }


  return (
    <>
      <Navbar />
      {
        isLoading ? ( // Show loading animation if isLoading is true
          <section style={{ backgroundColor: '#121212', color: 'white', height: '110vh' }}>
            <div className="text-center ">
              <div className="spinner-border text-primary " style={{ marginTop: '20%' }} role="status">
                <span className="visually-hidden ">Loading...</span>
              </div>
            </div>
          </section>
        ) : !profile ? (


          <section className='text-white' style={{ color: 'white', height: '85vh' }} >

            <div className="container  mt-2" >
              <div className="row">
                <div className="col-4">
                  <img src={profilebgimg} alt="" className=' h-100'
                    style={{ marginLeft: '-12px', width: '58.5vh' }} />
                </div>
                <div className="col-8 bg-dark">
                  <form action="" onSubmit={handleSubmit}>
                    <div className='d-flex justify-content-center align-items-center'>

                      <label htmlFor="file-upload" className='custom-file-upload pt-4'>
                        <img src={avatar} alt="" style={{ width: '50px' }} />
                      </label>
                    </div>
                    <div className='d-flex justify-content-center align-items-center mt-2 ms-5' >
                      <input
                        type="file"
                        lable="Image"
                        name="profileimg"
                        id='file-upload'
                        accept='.jpeg, .png, .jpg, .heic'
                        onChange={(e) => {
                          setImageUpload(e.target.files[0]);
                        }}
                      />
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Full Name</label>
                          <input type="text" name="name" class="form-control" value={formData.name} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Email</label>
                          <input type="email" name='email' class="form-control" value={formData.email} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Phone</label>
                          <input type="number" name='phone' class="form-control" value={formData.phone} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-5">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Address</label>
                          <input type="text" name='address' class="form-control" value={formData.address} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-3">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Date Of Birth</label>
                          <input type="date" name='dob' class="form-control" value={formData.dob} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-3">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">USN</label>
                          <input type="text" name='usn' class="form-control" value={formData.usn} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="mb-3">
                          <label htmlFor='category-select' className='me-2 ms-4 text-dark'>
                            Select Department
                          </label>
                          <select
                            id='category-select'
                            name='branch'
                            value={formData.branch} onChange={handleChange}
                            className='mt-3 w-100'
                          >
                            <option value='Computer Science And Engineering'>Computer Science And Engineering</option>
                            <option value='Electrical and communication Engineering'>Electrical and communication Engineering</option>
                            <option value='Electrical and Electronics Engineering'>Electrical and Electronics Engineering</option>
                            <option value='Mechanical Engineer'>Mechanical Engineering</option>
                            <option value='Master Of Technology'>Master Of Technology</option>
                            <option value='Master Of Computer Application'>Master Of Computer Application</option>
                            <option value='Master Of Business Administration'>Master Of Business Administration</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-2">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Semester</label>
                          <input type="number" name='sem' class="form-control" value={formData.sem} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-2">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Cgpa</label>
                          <input type="number" name='cgpa' class="form-control" value={formData.cgpa} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Skills</label>
                          <input type="text" name='skills' class="form-control" value={formData.skills} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Hobbies</label>
                          <input type="text" name='hobbies' class="form-control" value={formData.hobbies} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Languages Known</label>
                          <input type="text" name='languagesknown' class="form-control" value={formData.languagesknown} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className='mb-2'>Projects:</label>
                        {formData.projects.map((project, index) => (
                          <div key={index}>
                            <label className=''>
                              Year
                              <input
                                className='ms-2'
                                type="number"
                                name="year"
                                value={project.year}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </label>
                            <label className='ms-2'>
                              Title
                              <input
                                className='ms-2'
                                type="text"
                                name="title"
                                value={project.title}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </label>
                            <label className='ms-2'>
                              Technology
                              <input
                                type="text"
                                name="technology"
                                className='ms-2'
                                value={project.technology}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </label>
                            <button type="button" className='btn ' onClick={() => handleRemoveProject(index)}>
                              <RemoveIcon className="text-white"/>
                            </button>
                          </div>
                        ))}
                        <button type="button" className='mt-2' onClick={handleAddProject}>
                          Add Project
                        </button>
                      </div>
                      <div className="col-12">
                        <label htmlFor="" className='me-2 mt-2'>Upload Your Resume</label>
                        <input
                          type="file"
                          name="resume"
                          accept=".pdf"
                          onChange={(e) => handleResumeUpload(e)}
                        />
                      </div>
                      <div className="col-4 mb-3 mt-2">
                        <button type="submit" className='mt-2 btn btn-outline-primary' disabled={isLoading} >
                          {isLoading ? "Creating profile..." : "Create Profile"}
                        </button>
                      </div>
                      <div className="col-2">

                      </div>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </section>
        ) : (
          <section   className='' style={{ backgroundColor: '#121212', color: 'white', height: '90.9vh' }}>
            <div className="container">
              <div className="row">
                <div  className="col-3 shadow left mt-5 d-flex align-items-center" style={{ height: '80vh', backgroundColor: '#1e1e1f' }}>
                  <div className="profileimg mt-4 d-flex justify-content-center align-items-center" style={{ width: '7.5rem', height: '7.5rem', backgroundColor: '#1e1e1f' }}>
                    {profile.profileimg ? (
                      <img src={profile.profileimg} className='shadow' alt="" style={{ width: '6.5rem', height: '6.5rem', borderRadius: '60px' }} />
                    ) : (
                      <img src={profileimg} alt="" style={{ maxWidth: '10rem', maxHeight: '10rem' }} />
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
                      <div className="col-3 ">
                        <li className=' p-2 d-flex justify-content-center icon-list '><EmailOutlinedIcon className='icons' />
                        </li>
                        <li className='p-2 d-flex justify-content-center mt-4 icon-list' ><PhoneAndroidOutlinedIcon className='icons' /></li>
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
                <div  className="col-8 shadow ms-5 right mt-5" style={{ height: '80vh', backgroundColor: '#1e1e1f', width: '71.3%' }}>
                  <div className="box" style={{ marginLeft: '52.5vh', padding: '.4rem', width: '35%', overflow: 'hidden', position: 'absolute' }}>
                    <div className="container">
                      <nav class="navbar navbar-expand-lg" style={{ background: 'transparent' }}>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                          <span class="navbar-toggler-icon"></span>
                        </button>
                        <NavLink className="btn btn-outline-warning ms-auto" exact to='/modifyprofile'>
                          Update
                        </NavLink>
                      </nav>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className='skills text-white'>
                    <h2 className='fw-bold mt-4 ms-3'>About Me</h2>
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
                        <div className='skill-subdiv mt-4 ms-3 ' >
                          <div className="d-flex ">
                            <span className='p-2 d-flex align-items-center justify-content-center icon-list'><AcUnitIcon className=' icons' />

                            </span>
                            <h5 className='fw-bold ms-3 text-secondary mt-2' style={{ letterSpacing: '1px', fontStyle: 'italic', fontFamily: 'times-new-roman' }}>
                              Hobbies</h5>
                          </div>
                          <h6 className='data' style={{ marginLeft: '3.7rem' }}>{profile.hobbies}</h6>
                        </div>
                        <div className='skill-subdiv mt-4 ms-3 ' >
                          <div className="d-flex ">
                            <span className='p-2 d-flex align-items-center justify-content-center icon-list'><AcUnitIcon className=' icons' />

                            </span>
                            <h5 className='fw-bold ms-3 text-secondary mt-2' style={{ letterSpacing: '1px', fontStyle: 'italic', fontFamily: 'times-new-roman' }}>
                              Languages Known</h5>
                          </div>
                          <h6 className='data' style={{ marginLeft: '3.7rem' }}>{profile.languagesknown}</h6>
                        </div>
                        <div className='skill-subdiv mt-4 ms-3 ' >
                          <div className="d-flex ">
                            <span className='p-2 d-flex align-items-center justify-content-center icon-list'><AcUnitIcon className=' icons' />

                            </span>
                            <h5 className='fw-bold ms-3 text-secondary mt-2' style={{ letterSpacing: '1px', fontStyle: 'italic', fontFamily: 'times-new-roman' }}>
                              CGPA</h5>
                          </div>
                          <h6 className='data' style={{ marginLeft: '3.7rem' }}>{profile.cgpa}</h6>
                        </div>
                        <div className='ms-3 mt-5' >

                          {profile.resume && (
                            <div className="resume-container">
                              <button className='btn viewresumebtn shadow text-white mt-4' style={{ backgroundColor: 'black' }} onClick={openResume}>View Resume</button>
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
        )}



      <style>
        {`
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
      .icon-list {
        background: radial-gradient(circle at 10% 20%, rgb(69, 86, 102) 0%, rgb(30, 30, 30) 60%);
        border-radius: 10px;
        border-top: solid 2px #FFDB6E;
        border-left: solid 2px #FFDB6E;
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, .5);
        display: flex;  
        align-items: center;  
        justify-content: center;  
        height: 40px; 
        width: 40px;  
        margin-right: 10px; 
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

  );
};

export default Profile;

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

function convertToBase642(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}