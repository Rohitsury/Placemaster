import React, { useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';
import { useNavigate } from 'react-router-dom';
import 'aos/dist/aos.css'
import AOS from 'aos';
function ChangePassword() {
    let navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    originalPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/student/changepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message)
        navigate('/profile')
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to update password');
    }
  };

  useEffect(()=>{
    AOS.init({
        duration:1000
    })
  })
  return (
    <div>
      <Navbar />
      <section className='pt-5' style={{height:'90.9vh', backgroundColor:'rgb(18, 18, 18)'}}>
        <div className='container d-flex justify-content-center ' data-aos="zoom-out">
            <div className='p-5' style={{width:'37.8vw', borderRadius:'30px', backgroundColor:'rgb(30, 30, 31)'}}>
          <form onSubmit={handleSubmit} className='form shadow p-4 fg' style={{width:'30vw',borderRadius:'30px'}}>
            <h4 className='fw-bold' style={{letterSpacing:'1px'}}>Forgot Password</h4>
            <label htmlFor='email' className='fw-bold my-2'>Email</label>  
            <input
              type='email'
              name='email'
              className='form-control'
              value={formData.email}
              onChange={handleChange}
            /> 
            <label htmlFor='originalPassword' className='fw-bold my-2'>Existing Password</label>
            <input
              type='password'
              name='originalPassword'
              value={formData.originalPassword}
              onChange={handleChange}
              className='form-control'
            />
            <label htmlFor='newPassword' className='fw-bold my-2'>New Password</label>
            <input
              type='password'
              name='newPassword'
              value={formData.newPassword}
              onChange={handleChange}
              className='form-control'
            />
            <label htmlFor='confirmPassword' className='fw-bold my-2'>Retype New Password</label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='form-control'
            />

            <button type='submit' className='btn btn-primary mt-3'>Change</button>
          </form>
        </div>
        </div>
      </section>
      <style>
        {`
        
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Montserrat:wght@700&family=Open+Sans:wght@300;400&family=Poppins:wght@500;600;700&family=Raleway:wght@600&display=swap');
         .fg{
            background-image: linear-gradient(to right, #2b5876 0%, #4e4376  51%, #2b5876  100%);
            margin: 10px;
            padding: 15px 45px;
            transition: 0.5s;
            background-size: 200% auto;
            color: white;            
            box-shadow: 0 0 20px #eee;
            border-radius: 10px;
            display: block;
          }

        
         
        
        `}
      </style>
    </div>
  );
}

export default ChangePassword;
