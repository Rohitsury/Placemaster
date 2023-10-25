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
    companyname: "", description: "", branch: [], eligibility: "", ctc: "", passyear: "", joblocation: "", jobrole: "", registerbefore: "",
    drivedate: "", reglink: "", compimg: ''
  });
  const [imageUpload, setImageUpload] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  const imagesListRef = ref(storage, "images/");

  const uploadFile = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(storage, `images/${Date.now() + imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);

    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  };

  const createDriveWithImage = async (imageUrl) => {
    const numregex = /^[0-9\b]+$/
    if (!numregex.test(Credentials.passyear)) {
      alert("Year of passing must contain only numbers.");
      setIsLoading(false)
      return;
    }

    // const registerBeforeDate = new Date(Credentials.registerbefore);
    // const driveDate = new Date(Credentials.drivedate);
  
    // const currentDate = new Date();
  
    // if (registerBeforeDate <= currentDate || driveDate <= currentDate) {
    //   alert("Please select a future date for Register Before and Drive Date.");
    //   setIsLoading(false)
    //   return;
    // }

    if (imageUpload) {
      const fileExtension = imageUpload.name.split('.').pop().toLowerCase();
  
      if (!['jpg','jpeg','png'].includes(fileExtension)) {
        alert("Please select a valid video file (jpg, jpeg, png).");
        setIsLoading(false);
        return;
      }
    }
    const response = await fetch('http://localhost:5000/admin/createdrive', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        companyname: Credentials.companyname,
        description: Credentials.description,
        branch: Credentials.branch,
        eligibility: Credentials.eligibility,
        ctc: Credentials.ctc,
        passyear: Credentials.passyear,
        joblocation: Credentials.joblocation,
        jobrole: Credentials.jobrole,
        registerbefore: Credentials.registerbefore,
        drivedate: Credentials.drivedate,
        reglink: Credentials.reglink,
        compimg: imageUrl
      })
    });

    const data = await response.json();
    if (response.status === 400 || !data) {
      alert("Invalid Credentials");
      setIsLoading(false);
    } else {
      alert("Success");
      navigate('/companies');
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
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        [name]: checked
          ? [...prevCredentials[name], value]
          : prevCredentials[name].filter((item) => item !== value),
      }));
    } else {
      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        [name]: value,
      }));
    }
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

            <h4 className='mt-2' style={{ marginBottom: "-12px" }}>Create Drives</h4>
            <div className="box shadow effect1" style={{ width: "80%", height: "82vh", padding: "22px" }}>
              <div className='inner-div shadow' style={{ width: "97%", height: "74vh", padding: "40px", margin: "10px auto", borderRadius: "50px" }}>
                <form class="row g-3" method='POST' onSubmit={handleSubmit}>
                  <div class="col-md-12">
                    <label for="company" class="form-label">Company Name</label>
                    <input type="text" class="form-control" name="companyname" id="company" value={Credentials.companyname} onChange={onChange} />
                  </div>
                  <div class="col-md-12">
                    <label for="inputPassword4" class="form-label">Description</label>
                    <textarea type="text" class="form-control" name="description" value={Credentials.description} onChange={onChange} />
                  </div>
                  <div class="col-6">
                    <label for="inputAddress" class="form-label">Branches</label> <br />
                    <input class="form-check-input me-1" name="branch" type="checkbox" onChange={onChange} value="CSE"
                      checked={Credentials.branch.includes("CSE")} />
                    <label class="form-check-label me-3" for="flexCheckDefault">
                      CSE
                    </label>
                    <input class="form-check-input me-1" name="branch" type="checkbox" value="EC" checked={Credentials.branch.includes("EC")} onChange={onChange} id="flexCheckDefault" />
                    <label class="form-check-label me-3" for="flexCheckDefault">
                      EC
                    </label>
                    <input class="form-check-input me-1" name="branch" type="checkbox" value="EE" checked={Credentials.branch.includes("EE")} onChange={onChange} id="flexCheckDefault" />
                    <label class="form-check-label me-3" for="flexCheckDefault">
                      EE
                    </label>
                    <input class="form-check-input me-1" name="branch" type="checkbox" value="MCA" checked={Credentials.branch.includes("MCA")} onChange={onChange} id="flexCheckDefault" />
                    <label class="form-check-label me-3" for="flexCheckDefault">
                      MCA
                    </label>
                    <input class="form-check-input me-1" name="branch" type="checkbox" value="MTech" checked={Credentials.branch.includes("MTech")} onChange={onChange} id="flexCheckDefault" />
                    <label class="form-check-label me-3" for="flexCheckDefault">
                      MTech
                    </label>
                    <input class="form-check-input me-1" name="branch" type="checkbox" value="MBA" checked={Credentials.branch.includes("MBA")} onChange={onChange} id="flexCheckDefault" />
                    <label class="form-check-label" for="flexCheckDefault">
                      MBA
                    </label>
                  </div>
                  <div class="col-2">
                    <label for="inputAddress2" class="form-label">Eligible Criteria</label>
                    <input type="text" name="eligibility" class="form-control" value={Credentials.eligibility} id="inputAddress2" onChange={onChange} />
                  </div>
                  <div class="col-2">
                    <label for="inputAddress2" class="form-label">CTC</label>
                    <input type="text" name="ctc" class="form-control" value={Credentials.ctc} id="inputAddress2" onChange={onChange} />
                  </div>
                  <div class="col-md-2">
                    <label for="inputCity" class="form-label">Year of passing</label>
                    <input type="number" name="passyear" class="form-control" value={Credentials.passyear} id="inputCity" onChange={onChange} />
                  </div>
                  <div class="col-md-4">
                    <label for="inputCity" class="form-label">Job Location</label>
                    <input type="text" class="form-control" name="joblocation" onChange={onChange} value={Credentials.joblocation} id="inputCity" />
                  </div>
                  <div class="col-md-4">
                    <label for="inputCity" class="form-label">Job Role</label>
                    <input type="text" class="form-control" name="jobrole" onChange={onChange} value={Credentials.jobrole} id="inputCity" />
                  </div>
                  <div class="col-md-2">
                    <label for="inputState" class="form-label">Register Before</label>
                    <input type="date" class="form-control" name="registerbefore" onChange={onChange} value={Credentials.registerbefore} id="inputCity" />
                  </div>
                  <div class="col-md-2">
                    <label for="inputZip" class="form-label">Drive Date</label>
                    <input type="date" class="form-control" name="drivedate" onChange={onChange} value={Credentials.drivedate} id="inputZip" />
                  </div>
                  <div class="col-md-6">
                    <label for="linkInput">Registration Link:</label>
                    <input type="text" name="reglink" class="form-control" onChange={onChange} value={Credentials.reglink} />
                  </div>
                  <div class="col-md-6">
                    <label for="linkInput">Select Photo</label>
                    <input type="file" label="image" name="compimg" class="form-control" accept='.jpeg, .png, .jpg' onChange={(e) => {
                      setImageUpload(e.target.files[0]);
                    }}  />
                  </div>

                  <div class="col-12">
                    <button type="submit" class="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Creating Drive..." : "Create Drive"}
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


