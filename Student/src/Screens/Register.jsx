import React, { useState , useEffect} from 'react';
import Navbar from '../Component/Navbar';
import login from '../assets/login.png'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { NavLink, useNavigate } from 'react-router-dom';
import 'aos/dist/aos.css';
import AOS from 'aos';


const Register = () => {
  let navigate = useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [otp, setOtp] = useState('');
  const [isOTPVerificationEnabled, setIsOTPVerificationEnabled] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    const regex = /^[A-Za-z\s\b]+$/
    if (!regex.test(name)) {
      alert("Name field should Contains only Alphabets");
      return;
    }
    const numregex =/^[6-9]\d{9}$/;
    if (!numregex.test(phone)) {
      alert("Invalid Phone number");
      return;
    }
    // if (!usn.startsWith('02fe' || '02FE')) {
    //   alert("USN must start with '02fe'");
    //   return;
    // }
    try {
      const res = await fetch('http://localhost:5000/student/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, usn, password })
      });
      const result = await res.json();
      console.log(res.status)
      if (res.status === 202) {
        setId(result.userId);
        alert('Email sent Successfully');
        setIsOTPVerificationEnabled(true);
      } else {
          alert(result.message);
        }
    
    } catch (error) {
      console.log(error);
      
      alert('An error occurred during registration');
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/student/verifyotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, otp, name, email, phone, usn, password })
      });

      const result = await res.json();
      if (res.status === 200) {
        alert('Email verified successfully!');
        navigate('/')
      } 
      else if(res.status === 400)
      {
        alert('code has expired please click resend again')
      }
      else if(res.status === 401)
      { 
        alert('Provided otp is not correct')
      } 
      else {
        alert("err");
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred during OTP verification');
    }
  };

  const handleResentOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/student/resendotp', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, email })
      })
      alert("Email Sent Successfuly")
      setIsOTPVerificationEnabled(true)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    AOS.init({ duration: 1000 });
}, []);

  const Cancel = () =>{
    setIsOTPVerificationEnabled(false);
  }
  return (
    <>
      <Navbar />

      <section className=' loginsection container p-4' style={{height:'90vh'}}>
        <div className="container loginsection-subdiv  justiy-content-center align-items-center d-flex ">
          <div className="row loginsection-row shadow-lg" data-aos="zoom-in">
            <div className="col-lg-5 col-sm-12 bg-light">
              {
                isOTPVerificationEnabled ? (
                  <div>

                    <form onSubmit={handleOTPVerification}>
                      <div>
                      <ArrowCircleLeftOutlinedIcon className='fs-1 m-2' onClick={Cancel}/> 
                      <h4 className='text-center pt-1' style={{ fontFamily: 'times-new-roman' }}>Sign Up</h4>
                      </div>
                        <p className='ms-3 mb-3' style={{ fontFamily: 'times-new-roman', color:'gray', fontStyle:'italic', marginTop:'80px' }}>Verification OTP email sent to your entered email address </p>
                      <div className='text-center' style={{ marginTop: '30px' }}>

                        <label htmlFor="otp" className='me-3'>Enter OTP </label>
                        <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required /><br /><br />

                        <input type="submit" className='btn btn-primary' value="Verify OTP" />
                        <button className='btn btn-outline-primary ms-3' onClick={handleResentOTP}>Resend OTP</button>
                      </div>
                    </form>
                  </div>) : (

                  <form className='p-3' onSubmit={handleRegistration}>
                    <h4 className='text-center pt-1 ' style={{ fontFamily: 'times-new-roman' }}>Sign Up</h4>
                    <div class="mb-3">
                      <label for="exampleInputEmail1" class="form-label">Name</label>
                      <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div class="mb-3">
                      <label for="exampleInputEmail1" class="form-label">Email </label>
                      <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} />

                    </div>
                    <div className="row">
                      <div class="mb-3 col-6">
                        <label for="exampleInputPassword1" class="form-label">Phone</label>
                        <input type="text" class="form-control" id="exampleInputPassword1" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div class="mb-3 col-6">
                        <label for="exampleInputPassword1" class="form-label">USN</label>
                        <input type="text" class="form-control" id="exampleInputPassword1" value={usn} onChange={(e) => setUsn(e.target.value)} />
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="exampleInputPassword1" class="form-label">Password</label>
                      <input type="password" class="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div>
                      <button type="submit" class="btn btn-primary mb-2 ">Sign Up</button>
                    </div>
                    <div className='mt-4 text-center'>
                      <span>Already Have Account ? </span> <br /><NavLink type='submit' to='/login'>Sign In</NavLink>
                    </div>
                  </form>
                )}


            </div>
            <div className="col-lg-7 p-0 col-sm-12 ">
              <img src={login} alt="" className='img-fluid' style={{ height: "79vh" }} />
            </div>
          </div>

        </div>
      </section>




      <style>
        {`
            body{
              background:  #f6f5f7;
              
            }
      .loginsection-subdiv{
        height:84vh;
        width:85%; 
      }
    
      .loginsection-row{
        width:100%;
        // box-shadow:0 15px 10px 0 rgba(0,0,0,.5)
      }

      `}
      </style>

    </>
  );
};

export default Register;
