import React, { useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';
import kle from '../assets/kle.jpg';
import logo from '../assets/Logo.png';
import 'aos/dist/aos.css';
import AOS from 'aos';
import placedimg from '../assets/placedimg.jpg'

import UpcomingCompanies from '../Component/UpcomingCompanies';
import Footer from '../Component/Footer';
import PlacedStudent from '../Component/PlacedStudent';

function Home() {
    const [videoPlaying, setVideoPlaying] = useState(true); // State to manage video playing

    useEffect(() => {
      const video = document.getElementById("backgroundVideo");
      video.muted = true; // Mute the video to autoplay without sound
    }, []);
  
   
    useEffect(() => {
        AOS.init({ duration: 1000 })
    }, []);
    return (
        <>
            <Navbar />

            <video
                id="backgroundVideo"
                className="background-video"
                autoPlay
                loop
                controls
                 
            >
                <source src="https://firebasestorage.googleapis.com/v0/b/placemaster-50e4b.appspot.com/o/Videos%2FStudent%20Module.mp4?alt=media&token=455b4689-5c74-4fcb-911b-d03418fdf82a" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
           
            <section className='mainpage' style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,.7)), url(${kle})` }}>
                <div className="container">
                    <div className="row">
                        <div className='col-lg-8 col-sm-12 mainpagecol ' data-aos="zoom-in" style={{ marginTop: '20%' }}>
                            <h1>WELCOME TO KLE PLACEMASTER</h1>
                            <h5>Unlock Your Future: Your Gateway to Career Success!</h5>
                        </div>
                    </div>
                </div>
            </section>

            <section className='about' >
                <div className="container">
                    <div className="row pt-5 pb-5">
                        <div className="col-lg-6 col-sm-12" data-aos='fade-right'>
                            <h1 className='fw-bold'>ABOUT </h1>
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

            <PlacedStudent />

            {/* Upcoming Companies Section */}
            <section className='upcoming-Companies' style={{ height: "40vh" }}  >
                <div className="container" data-aos="fade-left">
                    <div className="row pt-5 mb-5">
                        <div className="col-lg-6 col-sm-12">
                            <h2 className='fw-bold'>UPCOMING COMPANIES</h2>
                        </div>
                        <div className="col-12">
                            <UpcomingCompanies />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@600&display=swap');
                  
                    .mainpage {
                    background-size: 100% 100%;
                    height: 100vh;
                    background-attachment: fixed;
                    overflow-x:hidden;
                    }
                    /* Add your existing CSS styles here */

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
                        font-style:italic;
                        color:gray;
                    }
                    .placedStudents{
                        background: linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.8)),url(${placedimg});
                        height:65vh;
                        background-size:100% 100%;
                        background-attachment: fixed;
                    }

                    .custom-carousel .carousel-card .st-img {
                        max-height: 130px; /* Adjust the image height as needed */
                        /* Add any additional styling you need */
                        width:130px;
                        border-radius:100px;
                        border:4px solid white;
                        background-color:red;
                    }

                    .upcoming-Companies{
                        // background-color:rgb(244, 244, 244);
                        color:black;
                    }
                   
                    .background-video {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index: 1; /* Place it behind other content */
                        max-width: 300px; /* Adjust the video's width as needed */
                      }
                  
                      .toggle-video-button {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index:  2; /* Place it above other content */
                        background-color: #fff;
                        border: none;
                        padding: 5px 10px;
                        cursor: pointer;
                      }
                      @media (max-width: 768px) {
                        /* Adjust styles for screens with a max width of 768px or smaller */
                        .mainpage h1 {
                          font-size: 2rem;
                        }
                        
                        .mainpage h5 {
                          font-size: 1.2rem;
                        }
                  
                        .about h1 {
                          font-size: 1.5rem;
                        }
                  
                        .about p {
                          font-size: 1rem;
                        }
                        .background-video {
                            bottom: 20px;
                            left: 0rem;
                          }
                      
                          .toggle-video-button {
                            position: fixed;
                            bottom: 20px;
                            left: 80px;
                          }
                      }
                      @media (max-width: 414) {
                        .background-video {
                            bottom: 20px;
                            left: 1rem;
                          }
                      
                          .toggle-video-button {
                            position: fixed;
                            bottom: 20px;
                            left: 0px;
                          }
                      }

                      @media (max-width: 393px) 
                      {
                        .background-video {
                            bottom: 0px;
                            left: 20px;
                             
                          }
                      
                          .toggle-video-button {
                            position: fixed;
                            bottom: 0px;
                            left: 20px;
                            
                          }
                      }
             
                `}
            </style>
        </>
    );
}

export default Home;
