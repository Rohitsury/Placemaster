import React, { useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';
import avatar from '../assets/profile.png'
import { NavLink, useNavigate } from 'react-router-dom';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";
function ModifyProfile() {
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

    const [imageUpload, setImageUpload] = useState(null);

    const imagesListRef = ref(storage, "Profileimges/");

    const uploadFile = async () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `Profileimges/${Date.now() + imageUpload.name + v4()}`);
        await uploadBytes(imageRef, imageUpload);
        const imageUrl = await getDownloadURL(imageRef);
        return imageUrl;
    };

    const [profile, setProfile] = useState(null)

    const token = localStorage.getItem('jwttoken');

    const handleChange = (e, index) => {
        if (e.target.name === 'year' || e.target.name === 'title' || e.target.name === 'technology') {
            const projects = [...formData.projects];
            projects[index][e.target.name] = e.target.value;
            setFormData({ ...formData, projects });
        }
        else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

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
        const regex = /^[A-Za-z\s\b]+$/
        if (!regex.test(formData.name)) {
            alert("Name field should Contains only Alphabets");
            return;
        }
        const numregex = /^[6-9]\d{9}$/;
        if (!numregex.test(formData.phone)) {
            alert("Invalid Phone number");
            return;
        }
        try {
            if (imageUpload) {
                const fileExtension = imageUpload.name.split('.').pop().toLowerCase();

                if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                    alert("Please select a valid video file (jpg, jpeg, png).");
                    return;
                }
            }
           
            const url = await uploadFile();
            const response = await fetch('http://localhost:5000/student/createprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, profileimg: url || '' })
            });

            await response.json();
            if (response.ok) {
                alert('Profile Updated successfully');
                navigate('/profile')
            } else {
                alert('Error creating profile');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        createProfile();
    };

    // const handleFileUpload = async (e) => {
    //     const file = e.target.files[0];
    //     const base64 = await converToBase64(file);
    //     setFormData({ ...formData, profileimg: base64 });
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
                        dob: new Date(data.profile.dob).toISOString().split('T')[0],
                        usn: data.profile.usn,
                        branch: data.profile.branch,
                        sem: data.profile.sem,
                        cgpa: data.profile.cgpa,
                        skills: data.profile.skills,
                        hobbies: data.profile.hobbies,
                        languagesknown: data.profile.languagesknown,
                        projects: data.profile.projects,
                        profileimg: data.profile.profileimg
                    });
                }
            } else {
                console.error('Error fetching profile:', data);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [token]);


    return (
        <>
            <Navbar />
            <section style={{ backgroundColor: '#121212', color: 'white', height: '110vh' }}>
                <div className="container">
                    <h5 className='pt-4' style={{ fontFamily: "times-new-roman", fontStyle: 'italic' }}>
                        Modify Profile
                    </h5>
                    <form action="" onSubmit={handleSubmit}>
                        <div className='d-flex justify-content-center align-items-center'>
                            <label htmlFor="file-upload" className='custom-file-upload'>
                                <img src={avatar} alt="" style={{ width: '100px' }} />
                            </label>
                        </div>
                        <div className='d-flex justify-content-center align-items-center mt-2 ms-5' >
                            <input
                                type="file"
                                lable="Image"
                                name="profileimg"
                                id='file-upload'
                                accept='.jpeg, .png, .jpg'
                                onChange={(e) => {
                                    setImageUpload(e.target.files[0]);
                                }}
                                style={{}}
                            />
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Full Name</label>
                                    <input type="text" name="name" class="form-control" value={formData.name} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                                </div>
                            </div>
                            <div className="col-4">
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
                            <div className="col-4">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Address</label>
                                    <input type="text" name='address' class="form-control" value={formData.address} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                                </div>
                            </div>
                            <div className="col-2">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Date Of Birth</label>
                                    <input type="date" name='dob' class="form-control" value={formData.dob} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                                </div>
                            </div>
                            <div className="col-2">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">USN</label>
                                    <input type="text" name='usn' class="form-control" value={formData.usn} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                                </div>
                            </div>
                            <div className="col-4">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Branch</label>
                                    <input type="text" name='branch' class="form-control" value={formData.branch} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
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
                            <div className="col-3">
                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Languages Known</label>
                                    <input type="text" name='languagesknown' class="form-control" value={formData.languagesknown} onChange={handleChange} style={{ backgroundColor: 'transparent', color: 'white' }} />
                                </div>
                            </div>
                            <div className="col-9">
                                <label className='mb-2'>Projects:</label>
                                {formData.projects.map((project, index) => (
                                    <div key={index}>
                                        <label className='me-2'>
                                            Year:
                                            <input
                                                className='ms-2'
                                                type="number"
                                                name="year"
                                                value={project.year}
                                                onChange={(e) => handleChange(e, index)}
                                            />
                                        </label>
                                        <label className='me-2'>
                                            Title:
                                            <input
                                                className='ms-2'
                                                type="text"
                                                name="title"
                                                value={project.title}
                                                onChange={(e) => handleChange(e, index)}
                                            />
                                        </label>
                                        <label>
                                            Technology:
                                            <input
                                                type="text"
                                                name="technology"
                                                value={project.technology}
                                                onChange={(e) => handleChange(e, index)}
                                            />
                                        </label>
                                        <button type="button" className='ms-2' onClick={() => handleRemoveProject(index)}>
                                            Remove Project
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="file"
                                    name="resume"
                                    accept=".pdf"
                                    onChange={(e) => handleResumeUpload(e)}
                                />
                                <button type="button" className='mt-2' onClick={handleAddProject}>
                                    Add Project
                                </button>
                            </div>
                            <div className="col-2">
                                <button className='mt-2 me-2 btn btn-warning' type='submit'  >
                                    Update
                                </button>
                                <NavLink to='/profile' className='mt-2 btn btn-outline-danger'  >
                                    Cancel
                                </NavLink>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

export default ModifyProfile


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