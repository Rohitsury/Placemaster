import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

function ForgotPassword({ close }) {
  let navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOTP = async () => {
    try {
      const res = await fetch('http://localhost:5000/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Send only 'email' in the request body
      });

      const data = await res.json()
      if (res.status === 404) {
        console.log(data.message)
        window.alert(data.message)
      }
      else if (res.status === 400) {
        alert(data.message)
      }
      else if (res.status === 500) {
        alert(data.message)
      }
  
      else {
        setUserId(data.user._id)
        setOtpSent(true);
        alert('Verification OTP has been sent to your email.');
      }
    } catch (error) {
      setMessage('Error sending OTP. Please try again later.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await fetch('http://localhost:5000/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email, otp, newPassword }),
      });

      const data = await res.json()
      if (res.status === 400) {
        alert(data.message)
      }
      else if (res.status === 404) {
        
        alert(data.message)
      }
      else if (res.status === 401) {
        alert(data.message)
      }

      else if (res.status === 500) {
        alert(data.message)
      }
      else{
        
        alert('Password reset successful. Please log in with your new password.');
        setOtpSent(false);
        close()
        navigate('/login')
        
      }
    } catch (error) {
      setMessage('Invalid OTP. Please check the code and try again.');
    }
  };

  return (
    <>
      <div className='separate-div' >
        <div className="separate-div-content" style={{ width: "40%", height: "40%" }}>
          <nav class="navbar navbar-light bg-light frgnavbar  justify-content-between">
            <h5 class="fw-bold" style={{ color: "#ff0080" }}> Forgot Password</h5>

            <button className="close-btn my-2 my-sm-0 " onClick={close}> <CloseIcon />  </button>
          </nav>
          {otpSent ? (
            <>
            <div className='d-flex justify-content-center align-items-center h-75' style={{flexDirection:'column'}}> 
              <input type="text" placeholder="Verification OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <input type="password" placeholder="New Password" className='my-3' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <button className='btn btn-dark mt-2' onClick={handleVerifyOTP}>Verify OTP and Reset Password</button>
              </div>
            </>
          ) : (
            <>
              <div className='d-flex justify-content-center align-items-center h-75' style={{flexDirection:'column'}}>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className='text-center form-control w-50'/> 
              <button className='btn btn-primary mt-3' onClick={handleSendOTP}>Send OTP</button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>
        {`
              
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
              `}
      </style>
    </>
  );
}

export default ForgotPassword;
