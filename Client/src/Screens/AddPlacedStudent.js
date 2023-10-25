import React, { useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { useNavigate } from 'react-router'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";
import DashboardNavbar from '../Component/DashboardNavbar';

function AddPlacedStudent() {
  const [studentname, setStudentName] = useState('')
  const [companyname, setCompanyName] = useState('')
  const [ctc, setctc] = useState('')
  const [branch, setbranch] = useState('')
  const [year, setyear] = useState('')
  const [imageUpload, setImageUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();
  const imagesListRef = ref(storage, "Placedstudent/");

  const uploadFile = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(storage, `Placedstudent/${Date.now() + imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);

    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  };


  const createPost = async (imageUrl) => {
    const regex = /^[A-Za-z\b]+$/
    if (!regex.test(studentname)) {
      alert("Name field should Contains only Alphabets");
      setIsLoading(false)
      return;
    }
    const numregex = /^[0-9\b]+$/
    if (!numregex.test(year)) {
      alert("Year of passing must contain only numbers.");
      return;
    }

    if (imageUpload) {
      const fileExtension = imageUpload.name.split('.').pop().toLowerCase();
  
      if (!['mp4'].includes(fileExtension)) {
        alert("Please select a valid video file (mp4).");
        setIsLoading(false);
        return;
      }
    }
    const response = await fetch('http://localhost:5000/admin/addplacedstudent', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },

      body: JSON.stringify({
        studentname, companyname, ctc, year, branch, compimg: imageUrl
      })
    });
    const data = await response.json();
    console.log(data)
    if (response.status === 400 || !data) {
      alert("Invalid Credentials")
      setIsLoading(false);
    }
    else {
      alert("Success")
      navigate('/PlacedStudent')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const imageUrl = await uploadFile();
      await createPost(imageUrl);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  }

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const base64 = await converToBase64(file);
  //   setPostImage({ ...postImage, compimg: base64 })
  // }

  return (
    <>
      {isLoading ? (

        <section style={{ color: 'white', height: '0', }}>
          <div className="text-center d-flex justify-content-center">
            <div className="spinner-border text-primary" style={{ marginTop: '20%' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </section>

      ) : null}
      <section>
        <div className="row">
          <Sidebar />
          <div className="col-lg-10 two">
            {/* Navbar */}
            <DashboardNavbar />
            {/* eND nAVBAR */}

            <h4 className='mt-2' style={{ marginBottom: "-12px" }}>Add Placed Student</h4>
            <div className="box shadow effect1" style={{ width: "80%", height: "82vh", padding: "22px" }}>
              <div className='inner-div shadow' style={{ width: "97%", height: "74vh", padding: "40px", margin: "10px auto", borderRadius: "50px" }}>
                <form class="row g-3" method='POST' onSubmit={handleSubmit}>
                  <div class="col-md-6">
                    <label for="company" class="form-label">Student Name</label>
                    <input type="text" class="form-control" name="companyname" id="company" onChange={(e) => setStudentName(e.target.value)} />
                  </div>
                  <div class="col-md-6">
                    <label for="inputPassword4" class="form-label">Company Name</label>
                    <input type="text" class="form-control" name="description" onChange={(e) => setCompanyName(e.target.value)} />
                  </div>

                  <div class="col-4">
                    <label for="inputAddress" class="form-label">Branch</label>
                    <input type="text" name="branch" class="form-control" id="inputAddress2" onChange={(e) => setbranch(e.target.value)} />
                  </div>
                  <div class="col-2">
                    <label for="inputAddress2" class="form-label">CTC</label>
                    <input type="text" name="ctc" class="form-control" id="inputAddress2" onChange={(e) => setctc(e.target.value)} />
                  </div>
                  <div class="col-md-2">
                    <label for="inputCity" class="form-label">Year</label>
                    <input type="number" name="year" class="form-control" id="inputCity" onChange={(e) => setyear(e.target.value)} />
                  </div>
                  <div class="col-md-4">
                    <label for="linkInput">Select Student Photo</label>
                    <input type="file" label="image" name="compimg" class="form-control mt-2" accept='.jpeg, .png, .jpg' onChange={(e) => {
                      setImageUpload(e.target.files[0]);
                    }} />
                  </div>

                  <div class="col-12">
                    <button type="submit" class="btn btn-primary" disabled={isLoading}>{isLoading ? "Adding Student..." : "Add Placed Student"}</button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>
        {`
              @import url('https://fonts.googleapis.com/css?family=Sofia:400,500,600,700&display=swap');

                .placemaster{
                    letter-spacing:1px;
                    font-family:Sofia
                }
                .box {
                  margin:10px 20px;
                  margin-top:30px;
                }
                /*==================================================
                 * Effect 1
                 * ===============================================*/
                .effect1{
                  border-radius:50px
                }
                h4{
                  font-family:times-new-roman;
                  margin-left:34%;
                }
                .inner-div{
                  background-image: linear-gradient(310deg,#141727,#3a416f);
                  color:white;
                }
                
                `}
      </style>
    </>
  )
}

export default AddPlacedStudent

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


