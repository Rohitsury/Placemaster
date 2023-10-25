import React, { useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';
import kle from '../assets/kle.jpg';
import logo from '../assets/Logo.png';
import 'aos/dist/aos.css';
import AOS from 'aos';

function Home() {
    
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);


    return (
        <>
            <Navbar />
            <section className='mainpage' style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,.7)), url(${kle})` }}>
                <div className="container">
                    <div className="row">
                        <div className='col-lg-8 col-sm-12 mainpagecol ' data-aos="zoom-in" style={{ marginTop: '20%' }}>
                            <h1>WELCOME TO KLE PLACEMASTER</h1>
                            <h5>Unlock Your Future: Your Gateway to Career Success!</h5>
                        </div>
                    </div>
                </div>
            </section>

            <section className='about ' >
                <div className="container">
                    <div className="row mt-5 mb-5">
                        <div className="col-lg-6 col-sm-12" data-aos='fade-right'>
                            <h1 className='fw-bold text-white'>About </h1>
                            <p>Placemaster is an advanced Placement Management System designed to streamline the entire campus recruitment process. Our platform offers a comprehensive solution for colleges, students, and recruiters, facilitating efficient and successful placements.
                                <br /> <br />With Placemaster, colleges can easily manage their placement activities, including job postings, student registrations, interview scheduling, and placement drives. Our user-friendly interface and automated workflows simplify the administrative tasks involved in placement processes.
                                <br /><br />  For students, Placemaster provides a centralized hub to explore job opportunities, submit applications, and showcase their skills and qualifications to potential employers. We offer personalized career guidance, resume building tools, and interview preparation resources to help students maximize their chances of securing their dream placements.
                            </p>
                        </div>
                        <div className="col-lg-6 col-sm-12 p-5  shadow d-flex justify-content-center align-items-center" data-aos='fade-left'>
                            <img src={logo} className='shadow' alt="" style={{ width: '70%' }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className='details'>

            </section>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@600&display=swap');
                    body{
                        overflow-X:hidden;
                    }
                    .mainpage {
                    background-size: 100% 100%;
                    height: 100vh;
                    background-attachment: fixed;
                    }
                    
                    .mainpagecol {
                    color: white;
                    font-family: 'Raleway', sans-serif;
                    letter-spacing: 2px;
                    }
                    
                    .mainpagecol h1 {
                    font-size: 3rem;
                    }
                    
                    .zoom-in {
                    animation: zoom-in-animation 1s ease-in-out forwards;
                    }
                    .about{
                        font-family: 'Raleway', sans-serif;
                    }
                    .about h1{  
                    letter-spacing: 1px;
                    }
                    .about p
                    {
                        color:gray; 
                    }
                `}
            </style>
        </>
    );
}

export default Home;
