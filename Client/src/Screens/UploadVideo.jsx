import React, { useState, useEffect } from 'react';
import Sidebar from '../Component/Sidebar';
import { useNavigate } from 'react-router';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";
import DashboardNavbar from '../Component/DashboardNavbar';

function CreateDrives() {
  const [Credentials, setCredentials] = useState({
    title: "", caption: "", video: ''
  });
  const [imageUpload, setImageUpload] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  const imagesListRef = ref(storage, "video/");

  const uploadFile = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(storage, `video/${Date.now() + imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);

    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  };

  const createDriveWithImage = async (imageUrl) => {
    if (imageUpload) {
      const fileExtension = imageUpload.name.split('.').pop().toLowerCase();
  
      if (!['mp4'].includes(fileExtension)) {
        alert("Please select a valid video file (mp4).");
        setIsLoading(false);
        return;
      }
    }
    const response = await fetch('http://localhost:5000/admin/uploadvideo', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        title: Credentials.title,
        caption: Credentials.caption,
        video: imageUrl
      })
    });

    const data = await response.json();
    if (response.status === 400 || !data) {
      alert("Invalid Credentials");
      setIsLoading(false);
    } else {
      alert("Successfully Post");
      navigate('/video');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const imageUrl = await uploadFile();
      await createDriveWithImage(imageUrl);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    
      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        [name]: value,
      }));
    
  };

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
            <DashboardNavbar/>
            {/* eND nAVBAR */}

            <h4 className='mt-2' style={{ marginBottom: "-12px" }}>Upload New Video</h4>
            <div className="box shadow effect1" style={{ width: "80%", height: "82vh", padding: "22px" }}>
              <div className='inner-div shadow' style={{ width: "97%", height: "74vh", padding: "40px", margin: "10px auto", borderRadius: "50px" }}>
                <form class="row g-3" method='POST' onSubmit={handleSubmit}>
                  <div class="col-md-12">
                    <label for="company" class="form-label">Title</label>
                    <input type="text" class="form-control" name="title" id="company" value={Credentials.title} onChange={onChange} />
                  </div>
                  <div class="col-md-12">
                    <label for="inputPassword4" class="form-label">Caption</label>
                    <textarea type="text" class="form-control" name="caption" value={Credentials.caption} onChange={onChange} />
                  </div>
                    
                  <div class="col-md-6">
                    <label for="linkInput">Select Video</label>
                    <input type="file" label="image" name="video" class="form-control" accept='.mp4' onChange={(e) => {
                      setImageUpload(e.target.files[0]);
                    }}  />
                  </div>

                  <div class="col-12">
                    <button type="submit" class="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Posting Video..." : "Post Video"}
                    </button>
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

export default CreateDrives

// function converToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result)
//     };
//     fileReader.onerror = (error) => {
//       reject(error)
//     }
//   })
// }


