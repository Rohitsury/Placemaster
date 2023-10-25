import React, { useEffect, useState } from 'react';
import Sidebar from '../Component/Sidebar';
import { NavLink } from 'react-router-dom';
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

function Companies() {

    const [compdata, setCompdata] = useState([]);
    const [search, setSearch] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedCompany, setSelectedCompany] = useState({});
    const [update, setUpdate] = useState(false);
    const [Open, setOpen] = useState(false);
    const [Credentials, setCredentials] = useState({
        companyname: "", description: "", branch: [], eligibility: "", ctc: "", passyear: "", joblocation: "", jobrole: "", registerbefore: "",
    drivedate: "", reglink: "", compimg: ''
    });
    const [postImage, setPostImage] = useState({ compimg: "" })
    const [imageUpload, setImageUpload] = useState(null);


    const imagesListRef = ref(storage, "companies/");

    const uploadFile = async () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `companies/${Date.now() + imageUpload.name + v4()}`);
        await uploadBytes(imageRef, imageUpload);
        const imageUrl = await getDownloadURL(imageRef);
        setCredentials({ ...Credentials, compimg: imageUrl });
        return imageUrl;
    };
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
        console.log(filter)
        setActiveFilter(filter)
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


        setSearch(filteredData);
    };

    const openModal = (company) => {
        setSelectedCompany(company);
        setOpen(true);
    };
    const openModal2 = (company) => {
        setSelectedCompany({
            ...company,
            compimg: company.compimg, // Populate the compimg property
        });
        setCredentials(company);
        setOpen(true)
        setUpdate(true);
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

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm("Are Your Sure!?")
            if (confirmed) {
                const res = await fetch(`http://localhost:5000/admin/${id}`, {
                    method: 'DELETE'
                })
                getData()
                const newRecords = compdata.filter((el) => el._id !== id);
                setSearch(newRecords);
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const numregex = /^[0-9\b]+$/
            if (!numregex.test(Credentials.passyear)) {
                alert("Year of passing must contain only numbers.");
                return;
              }
            const r = await uploadFile()

            const res = await fetch(`http://localhost:5000/admin/${selectedCompany._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...Credentials, compimg: r }),
            });

            if (res.ok) {

                const updatedData = compdata.map((company) => {
                    if (company._id === selectedCompany._id) {
                        return { ...company, ...Credentials };
                    }
                    return company;
                });

                setSearch(updatedData);
                setOpen(false);
                setUpdate(false);
                alert("Successfully Updated")
            } else {
                console.log('Update failed');
            }
        } catch (error) {
            console.log(error);
        }
        getData()
    };

    // const handleImageChange = async (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const base64 = await converToBase64(file);
    //         setPostImage({ ...postImage, compimg: base64 });
    //     }
    // };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <section className={Open ? 'fixed' : ''}>
                <div className="row">
                    <Sidebar />
                    <div className="col-lg-10 two">
                        {/* Navbar */}
                        <nav className="navbar navbar-expand-lg px-3" style={{ borderRadius: '' }}>
                            <div className="container-fluid">
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <div className="me-auto">
                                        <h5 className="fw-bold placemaster font-effect-shadow-multiple">PLACEMASTER</h5>
                                    </div>
                                    <div>
                                        <form className="d-flex">
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
                                </div>
                            </div>
                        </nav>
                        {/* END NAVBAR */}

                        {/* Company card */}
                        <div className="row mt-3 pe-2">
                            <div>
                                <NavLink
                                    // className="btn company-btn me-4"
                                    exact
                                    className={`btn me-4 shadow ${activeFilter === 'all' ? 'actives' : 'btn-white '}`}
                                    onClick={() => handleFilter('all')} style={{ border: 'none' }}
                                >
                                    All
                                </NavLink>

                                <NavLink
                                    onClick={() => handleFilter('upcoming')} style={{ border: 'none' }}
                                    className={`btn  me-4 shadow ${activeFilter === 'upcoming' ? 'actives' : 'btn-white'}`}
                                >
                                    Upcoming
                                </NavLink>

                                <NavLink
                                    // className="btn company-btn"
                                    onClick={() => handleFilter('past')} style={{ border: 'none' }}
                                    className={`btn   me-4 shadow ${activeFilter === 'past' ? 'actives' : 'btn-white'}`}
                                >
                                    Past
                                </NavLink>
                            </div>
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
                                <div className="col-sm-3 mt-4" style={{ height: '53vh' }}>
                                    <div className="card shadow" style={{ width: '18rem', border: 'none', borderRadius: '20px' }}>
                                        <img src={item.compimg} className="card-img-top" alt="..." style={{ height: '100px', borderRadius: '20px', objectFit: 'fill' }} />
                                        <div className="card-body">
                                            <h5 className="card-title">{item.companyname}</h5>
                                        </div>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                Drive Date : <span>{new Date(item.drivedate).toLocaleDateString()}</span>
                                            </li>
                                            <li className="list-group-item">
                                                CTC : <span>{item.ctc}</span>
                                            </li>
                                            <li className="list-group-item">
                                                Branches: {item.branch}
                                            </li>
                                        </ul>
                                        <div className="card-body">
                                            <button className="card-link btn btn-primary" onClick={() => openModal(item)}>
                                                View
                                            </button>
                                            <button className="card-link btn btn-warning" onClick={() => openModal2(item)}>
                                                Update
                                            </button>
                                            <button className="card-link btn btn-danger" onClick={() => handleDelete(item._id)} >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* End Company card */}
                    </div>
                </div>
            </section>

            {/* Separate div */}
            {Open && (
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
                                <h5>Branches: {selectedCompany.branch}</h5>
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
            )};
            {update && (
                <div className={`separate-div  ${Open ? 'open' : ''}`} >
                    <div className=" separate-div-content shadow bg-white" style={{ width: "80%", height: "80%" }}>
                        <nav class="navbar  justify-content-between">
                            {/* <h2 class="fw-bold" style={{ color: "#ff0080" }}>{selectedCompany.companyname}</h2> */}
                            <div></div>

                            <button className="close-btn mx-auto mx-sm-0 " onClick={close}> <CloseIcon />  </button>
                        </nav>

                        <div className='inner-div shadow' style={{ width: "97%", height: "74vh", padding: "40px", margin: "-8px auto", borderRadius: "50px" }}>

                            <form class="row g-3" method='PATCH' onSubmit={handleUpdate} >
                                <div class="col-md-12">
                                    <label for="company" class="form-label">Company Name</label>
                                    <input type="text" class="form-control" name="companyname" id="company" value={Credentials.companyname}
                                        onChange={onChange} />
                                </div>
                                <div class="col-md-12">
                                    <label for="inputPassword4" class="form-label">Description</label>
                                    <textarea type="password" class="form-control" name="description" value={Credentials.description}
                                       onChange={onChange} />
                                </div>
                                <div class="col-6">
                                    <label for="inputAddress" class="form-label">Branches</label> <br />
                                    <input class="form-check-input me-1" name="branch" type="checkbox" value="CSE"checked={Credentials.branch.includes("CSE")}
                                       onChange={onChange}
                                    />
                                    <label class="form-check-label me-3" for="flexCheckDefault">
                                        CSE
                                    </label>
                                    <input class="form-check-input me-1" name="branch" type="checkbox" value="EC" id="flexCheckDefault"
                                    checked={Credentials.branch.includes("EC")}
                                    onChange={onChange} />
                                    <label class="form-check-label me-3" for="flexCheckDefault">
                                        EC
                                    </label>
                                    <input class="form-check-input me-1" name="branch" type="checkbox" value="EE" id="flexCheckDefault"
                                    checked={Credentials.branch.includes("EE")}
                                    onChange={onChange} />
                                    <label class="form-check-label me-3" for="flexCheckDefault">
                                        EE
                                    </label>
                                    <input class="form-check-input me-1" name="branch" type="checkbox" value="MCA" id="flexCheckDefault"
                                    checked={Credentials.branch.includes("MCA")}
                                    onChange={onChange} />
                                    <label class="form-check-label me-3" for="flexCheckDefault">
                                        MCA
                                    </label>
                                    <input class="form-check-input me-1" name="branch" type="checkbox" value="MTech"
                                    checked={Credentials.branch.includes("MTech")}
                                    onChange={onChange}/>
                                    <label class="form-check-label me-3" for="flexCheckDefault">
                                        MTech
                                    </label>
                                    <input class="form-check-input me-1" name="branch" type="checkbox" value="MBA" id="flexCheckDefault"
                                      checked={Credentials.branch.includes("MBA")}
                                      onChange={onChange} />
                                    <label class="form-check-label" for="flexCheckDefault">
                                        MBA
                                    </label>
                                </div>
                                <div class="col-2">
                                    <label for="inputAddress2" class="form-label">Eligible Criteria</label>
                                    <input type="text" name="eligibility" class="form-control" value={Credentials.eligibility}
                                       onChange={onChange}/>
                                </div>
                                <div class="col-2">
                                    <label for="inputAddress2" class="form-label">CTC</label>
                                    <input type="text" name="ctc" class="form-control" value={Credentials.ctc}
                                       onChange={onChange} />
                                </div>
                                <div class="col-md-2">
                                    <label for="inputCity" class="form-label">Year of passing</label>
                                    <input type="number" name="passyear" class="form-control" id="inputCity" value={Credentials.passyear}
                                        onChange={onChange}/>
                                </div>
                                <div class="col-md-4">
                                    <label for="inputCity" class="form-label">Job Location</label>
                                    <input type="text" class="form-control" name="joblocation" id="inputCity" value={Credentials.joblocation}
                                        onChange={onChange} />
                                </div>
                                <div class="col-md-4">
                                    <label for="inputCity" class="form-label">Job Role</label>
                                    <input type="text" class="form-control" name="jobrole" value={Credentials.jobrole}
                                        onChange={onChange} />
                                </div>
                                <div class="col-md-2">
                                    <label for="inputState" class="form-label">Register Before</label>
                                    <input type="date" class="form-control" name="registerbefore" id="inputCity" value={Credentials.registerbefore} onChange={onChange} />
                                </div>
                                <div class="col-md-2">
                                    <label for="inputZip" class="form-label">Drive Date</label>
                                    <input type="date" class="form-control" name="drivedate" value={Credentials.drivedate}
                                        onChange={onChange} />
                                </div>
                                <div class="col-md-6">
                                    <label for="linkInput">Registration Link:</label>
                                    <input type="text" name="reglink" class="form-control" value={Credentials.reglink}
                                       onChange={onChange} />
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

          .placemaster {
            letter-spacing: 1px;
            font-family: Sofia;
          }
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
          .company-btn {
            border-radius: 10px;
            box-shadow: 0 1px 12px rgba(0, 0, 0, 0.15) !important;
            font-family: times-new-roman;
          }
          .company-btn:hover {
            color: white;
            box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
          }
        //   .btn {
        //     color: white;
        //     background-image: linear-gradient(310deg, #7928ca, #ff0080);
        //     border: none;
        //   }
          .actives{
            color:white!important;
            background-image: linear-gradient(310deg, #7928ca, #ff0080);
            border: none!important;
            font-weight:bold;
          }

          /* separate div */
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

           
        //   .box {
        //     margin:10px 20px;
        //     margin-top:10px;
        //   }
          
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
        `}
            </style>
        </>
    );
}

export default Companies;


// function converToBase64(file) {
//     return new Promise((resolve, reject) => {
//         const fileReader = new FileReader();
//         fileReader.readAsDataURL(file);
//         fileReader.onload = () => {
//             resolve(fileReader.result)
//         };
//         fileReader.onerror = (error) => {
//             reject(error)
//         }
//     })
// }