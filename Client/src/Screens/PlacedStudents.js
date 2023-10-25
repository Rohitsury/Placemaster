import React, { useState, useEffect } from 'react'
import Sidebar from '../Component/Sidebar'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";
import { useNavigate } from 'react-router';
import DashboardNavbar from '../Component/DashboardNavbar';


function PlacedStudents() {

  const [students, setStudents] = useState([]);
  const [update, setUpdate] = useState(false);
  const [Open, setOpen] = useState(false);
  const [updatedCompany, setUpdatedCompany] = useState({});
  const [selectedCompany, setSelectedCompany] = useState({});
  const [imageUpload, setImageUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  const imagesListRef = ref(storage, "Placedstudent/");

  const uploadFile = async () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `Placedstudent/${Date.now() + imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);
    const imageUrl = await getDownloadURL(imageRef);
    setUpdatedCompany({ ...updatedCompany, compimg: imageUrl });  
    return imageUrl;
  };
  

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/placedstudents');
      const data = await response.json();
      setStudents(data.results);
    } catch (err) {
      console.log(err);
    }
  };

  const openModal2 = (company) => {
    setSelectedCompany(company);
    setUpdatedCompany(company);
    setOpen(true)
    setUpdate(true);
  };

  const close = () => {
    setOpen(false);
    setUpdate(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Are Your Sure!?")
      if (confirmed) {
        const res = await fetch(`http://localhost:5000/admin/placedstudent/${id}`, {
          method: 'DELETE'
        })
      
      if(res.status === 200)
      {
        alert("deleted Successfully");
        fetchStudentData()
      }
    }
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      
      const r = await uploadFile()
      console.log(r)
      const res = await fetch(`http://localhost:5000/admin/placedstd/${selectedCompany._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...updatedCompany, compimg:r}),
      });

      if (res.ok) {
        setOpen(false);
        setUpdate(false);
        alert("Successfully Updated")
      } else {
        console.log('Update failed');
      }
    } catch (error) {
      console.log(error);
    }
    fetchStudentData()
  };

 

 

  return (
    <>
      <section>
        <div className="row">
          <Sidebar />
          <div className="col-lg-10 two">
        <DashboardNavbar/>

            <div className="row mt-3 pe-2">

              <div className="row mt-3 pe-2">
                <h3 style={{ fontFamily: 'times-new-roman' }}>Placed Students</h3>
                {students.map((student, index) => (
                  <div key={student.studentname} className="col-sm-3 mt-4" style={{ height: '55vh' }}>
                    <div className="card shadow p-3" style={{ width: '18rem', border: 'none', borderRadius: '20px' }}>
                      <div className="student-card-inne-div" style={{ borderRadius: '20px' }}>
                        <div className="pt-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <img
                            src={student.compimg}
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
                            Name : <span>{student.studentname}</span>
                          </li>
                          <li className="list-group-item text-white" style={{ fontSize: '12px' }}>
                            Branch : <span>{student.branch}</span>
                          </li>
                          <li className="list-group-item text-white" style={{ fontSize: '12px' }}>
                            Company Name : <span>{student.companyname}</span>
                          </li>
                          <li className="list-group-item text-white" style={{ fontSize: '12px' }}>
                            CTC : <span>{student.ctc}</span>
                          </li>
                          <li className="list-group-item text-white" style={{ fontSize: '12px' }}>
                            Placed Year : <span>{student.year}</span>
                          </li>
                        </ul>
                        <div className="card-body">
                          <button className="card-link btn btn-warning" onClick={() => openModal2(student)}>
                            Update
                          </button>
                          <button className="card-link btn btn-danger" onClick={() => handleDelete(student._id)} >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {update && (
        <div className={`separate-div  ${Open ? 'open' : ''}`} >
          <div className=" separate-div-content shadow bg-white" style={{ width: "80%", height: "80%" }}>
            <nav class="navbar  justify-content-between">

              <div></div>

              <button className="close-btn mx-auto mx-sm-0 " onClick={close}> <CloseIcon />  </button>
            </nav>

            <div className='inner-div shadow' style={{ width: "97%", height: "74vh", padding: "40px", margin: "-8px auto", borderRadius: "50px" }}>

              <form class="row g-3" method='PATCH' onSubmit={handleUpdate} >
                <div class="col-md-12">
                  <label for="company" class="form-label">Student Name</label>
                  <input type="text" class="form-control" name="studentname" id="company" value={updatedCompany.studentname}
                    onChange={(e) => setUpdatedCompany({ ...updatedCompany, studentname: e.target.value })} />
                </div>
                <div class="col-md-12">
                  <label for="company" class="form-label">Company Name</label>
                  <input type="text" class="form-control" name="companyname" id="company" value={updatedCompany.companyname}
                    onChange={(e) => setUpdatedCompany({ ...updatedCompany, companyname: e.target.value })} />
                </div>

                <div class="col-6">
                  <label for="inputAddress" class="form-label">Branches</label> <br />
                  <input class="form-control me-1" name="branch" type="text" value={updatedCompany.branch}
                    onChange={(e) => setUpdatedCompany({ ...updatedCompany, branch: e.target.value })}
                  />
                </div>
                <div class="col-2">
                  <label for="inputAddress2" class="form-label">CTC</label>
                  <input type="text" name="ctc" class="form-control" value={updatedCompany.ctc}
                    onChange={(e) => setUpdatedCompany({ ...updatedCompany, ctc: e.target.value })} />
                </div>
                <div class="col-md-2">
                  <label for="inputCity" class="form-label">Year of passing</label>
                  <input type="number" name="year" class="form-control" id="inputCity" value={updatedCompany.year}
                    onChange={(e) => setUpdatedCompany({ ...updatedCompany, year: e.target.value })} />
                </div>
                <div class="col-md-6">
                  <label for="linkInput">Select Photo</label>
                  <input type="file" label="image" name="compimg" class="form-control" accept='.jpeg, .png, .jpg'
                   onChange={(e) => {
                    setImageUpload(e.target.files[0]);
                  }} />
                </div>

                <div class="col-12">
                  <button type="submit" class="btn btn-primary">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
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

export default PlacedStudents

// function converToBase64(file) {
//   return new Promise((resolve, reject) => {
//       const fileReader = new FileReader();
//       fileReader.readAsDataURL(file);
//       fileReader.onload = () => {
//           resolve(fileReader.result)
//       };
//       fileReader.onerror = (error) => {
//           reject(error)
//       }
//   })
// }