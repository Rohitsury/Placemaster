import React, { useState } from 'react';
import { NavLink, useNavigate, useParams  } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import ForgotPassword from '../Component/ForgotPassword';

function AdminLogin() {
    const navigate = useNavigate();
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');

    const [cookies, setCookie] = useCookies(['jwttoken']);
    const [Open, setOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid, password }),
        });

        console.log(response);
        const data = await response.json();

        if (response.status === 400 || !data) {
            alert('Invalid Credentials');
        }
        else {
            alert('Logged in successfully');
            localStorage.setItem('jwttoken', data.authtoken)
            navigate('/dashboard');
             
        }   
    };

    const Opendiv = () => {
        setOpen(true)
        navigate('/forgotpassword');
    }
    const close = () => {
        setOpen(false)
        navigate('/');
    }
    const handleCheckbox = (e) => {
        setIsChecked(e.target.checked)
    }


    return (
        <>
            <div>
                <nav className="login-navbar navbar shadow p-lg-3">
                    <div className="container">
                        <h4>PLACEMASTER</h4>
                    </div>
                </nav>
            </div>
            <section className="main">
                <div className="wrapper">
                    <div className="title">
                        Login
                    </div>
                    <form method="POST" onSubmit={handleSubmit} className='login-form'>
                        <div className="field">
                            <input type="text" required value={userid} onChange={(e) => setUserid(e.target.value)} />
                            <label>User ID</label>
                        </div>
                        <div className="field">
                            <input type={isChecked ? "text" : "password"} required value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <label>Password</label>
                        </div>
                        <div className="content">
                            <div className="checkbox">
                                <input type="checkbox" id="remember-me" onChange={handleCheckbox} />
                                <label for="remember-me">Show Password</label>
                            </div>
                            <div className="pass-link">
                                <NavLink  onClick={Opendiv}>Forgot password?</NavLink>
                            </div>

                        </div>
                        <div className="field">
                            <input type='submit' value='login' />
                        </div>

                    </form>

                </div>
            </section>

            {Open && (
                <ForgotPassword close={close} />
            )};
            <style>
                {`
            
                    @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');
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
                      .frgnavbar{
                        margin-top:-12px;
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
                        background: white;
                        position: absolute;
                        // background: black;
                        color:white;
                        box-shadow: 0px 15px 20px rgba(0,0,0,0.5);
                      }
                   
            
                      .close-btn {
                        background: #ff0080;
                        color: white;
                        border: none;
                        
                        padding: 3px 3px;
                        border-radius: 5px;
                        cursor: pointer;
                      }
                            .main{
                            display: grid;
                            height: 90vh;
                            width: 100%;
                            place-items: center;
                            }
                            .login-navbar {
                                background: linear-gradient(-135deg, #c850c0, #4158d0);
                                /* background-color: black; */
                            }
                            .login-navbar  h4{
                                font-family: 'Poppins', sans-serif;
                                color: white;
                                    letter-spacing: 1px;
                                font-weight: bold;
                            }


                            /* Navbar */
                            /* Carousel styling */
                            #introCarousel,
                            .carousel-inner,
                            .carousel-item,
                            .carousel-item.active {
                            height: 100vh;
                            }

                            .carousel-item:nth-child(1) {
                            background-image: url('https://mdbootstrap.com/img/Photos/Others/images/76.jpg');
                            background-repeat: no-repeat;
                            background-size: cover;
                            background-position: center center;
                            }

                            .carousel-item:nth-child(2) {
                            background-image: url('https://mdbootstrap.com/img/Photos/Others/images/77.jpg');
                            background-repeat: no-repeat;
                            background-size: cover;
                            background-position: center center;
                            }

                            .carousel-item:nth-child(3) {
                            background-image: url('https://mdbootstrap.com/img/Photos/Others/images/78.jpg');
                            background-repeat: no-repeat;
                            background-size: cover;
                            background-position: center center;
                            }

                            /* Height for devices larger than 576px */
                            @media (min-width: 992px) {
                            #introCarousel {
                                margin-top: -58.59px;
                            }
                            }

                            .login-navbar  .nav-link {
                            color: #fff !important;
                            }




                            ::selection{
                            background: #4158d0;
                            color: #fff;
                            }
                            .wrapper{
                            width: 380px;
                            background: #fff;
                            border-radius: 15px;
                            box-shadow: 0px 15px 20px rgba(0,0,0,0.1);
                            }
                            .wrapper .title{
                            font-size: 35px;
                            font-weight: 600;
                            text-align: center;
                            line-height: 100px;
                            color: #fff;
                            user-select: none;
                            border-radius: 15px 15px 0 0;
                            background: linear-gradient(-135deg, #c850c0, #4158d0);
                            }
                            .wrapper form{
                            padding: 10px 30px 50px 30px;
                            }
                            .wrapper form .field{
                            height: 50px;
                            width: 100%;
                            margin-top: 20px;
                            position: relative;
                            }
                            .wrapper .login-form .field input{
                            height: 100%;
                            width: 100%;
                            outline: none;
                            font-size: 17px;
                            padding-left: 20px;
                            border: 1px solid lightgrey;
                            border-radius: 25px;
                            transition: all 0.3s ease;
                            }
                            .wrapper .login-form .field input:focus,
                            form .field input:valid{
                            border-color: #4158d0;
                            }
                            .wrapper .login-form .field label{
                            position: absolute;
                            top: 50%;
                            left: 20px;
                            color: #999999;
                            font-weight: 400;
                            font-size: 17px;
                            pointer-events: none;
                            transform: translateY(-50%);
                            transition: all 0.3s ease;
                            }
                            .login-form .field input:focus ~ label,
                            .login-form .field input:valid ~ label{
                            top: 0%;
                            font-size: 16px;
                            color: #4158d0;
                            background: #fff;
                            transform: translateY(-50%);
                            }
                            .login-form .content{
                            display: flex;
                            width: 100%;
                            height: 50px;
                            font-size: 16px;
                            align-items: center;
                            justify-content: space-around;
                            }
                            .login-form .content .checkbox{
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            }
                            .login-form .content input{
                            width: 15px;
                            height: 15px;
                            background: red;
                            }
                            .login-form .content label{
                            color: #262626;
                            user-select: none;
                            padding-left: 5px;
                            }
                            .login-form .content .pass-link{
                            color: "";
                            }
                            .login-form .field input[type="submit"]{
                            color: #fff;
                            border: none;
                            padding-left: 0;
                            margin-top: -10px;
                            font-size: 20px;
                            font-weight: 500;
                            cursor: pointer;
                            background: linear-gradient(-135deg, #c850c0, #4158d0);
                            transition: all 0.3s ease;
                            }
                            .login-form .field input[type="submit"]:active{
                            transform: scale(0.95);
                            }
                            .login-form .signup-link{
                            color: #262626;
                            margin-top: 20px;
                            text-align: center;
                            }
                            .login-form .pass-link a,
                            .login-form .signup-link a{
                            color: #4158d0;
                            text-decoration: none;
                            }
                            .login-form .pass-link a:hover,
                            .login-form .signup-link a:hover{
                            text-decoration: underline;
                            }
                                        `



                }
            </style>
        </>
    );
}
export default AdminLogin;