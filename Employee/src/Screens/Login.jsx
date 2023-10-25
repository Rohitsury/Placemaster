import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../Component/Navbar'
import login from '../assets/login.png'
import ForgotPassword from './ForgotPassword';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import 'aos/dist/aos.css';
import AOS from 'aos';


function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Open, setOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
}, []);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/employee/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log(response);
    const data = await response.json();

    if (response.status === 400 || !data) {
      alert('Invalid Credentials');
    }
    else {
      alert('Logged in successfully');
      localStorage.setItem('jwttoken', data.authtoken)
      navigate('/');
    }
  };

  const Opendiv = () => {
    setOpen(true)
    navigate('/forgotpassword');
}

const close = () => {
  setOpen(false)
  navigate('/login');
}
  return (
    <>
      <Navbar />
      <section className="loginsection"  >
        <div className='  container p-4'>

          <div className="container loginsection-subdiv  justiy-content-center align-items-center d-flex ">
            <div className="row loginsection-row shadow" data-aos="zoom-in">
              <div className="col-lg-5 col-sm-12 bg-light">

                <div className='text-center mt-4'>
                  <AccountCircleIcon style={{ fontSize: "80px" }} />
                  <h4 style={{ fontFamily: 'times-new-roman' }}>Sign In</h4>
                </div>
                <form className='p-4' onSubmit={handleSubmit}>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => { setEmail(e.target.value) }} />

                  </div>
                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                  </div>
                  <div>
                    <button type="submit" class="btn btn-primary mb-2 ">Sign In</button>
                  </div>
                  <NavLink onClick={Opendiv}>Forgot Password</NavLink>
                  <div className='mt-4 text-center'>
                    <span>Don't Have Account ? </span> <br /><NavLink to='/register'>Sign Up</NavLink>
                  </div>

                </form>

              </div>
              <div className="col-lg-7 p-0 col-sm-12 ">
                <img src={login} alt="" className='img-fluid' style={{ height: "72vh",width:'100%' }} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {Open && (
        <ForgotPassword   close={close}/>
      )};


      <style>
        {`
        body{
          background:  #f6f5f7;
          
        }
        .loginsection-subdiv{
          height:83vh;
          width:85%; 
        }
      
        .loginsection-row{
          width:100%;
          // box-shadow:0 15px 10px 0 rgba(0,0,0,.5)
        }

        `}
      </style>
    </>
  )
}

export default Login