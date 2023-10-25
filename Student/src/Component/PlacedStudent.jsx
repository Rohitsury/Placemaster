import React, { useState, useEffect } from 'react'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
function PlacedStudent() {
    const [students, setStudents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchStudentData = async () => {
        try {
            const response = await fetch('http://localhost:5000/admin/placedstudents');
            const data = await response.json();
            setStudents(data.results);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStudentData();
        AOS.init({ duration: 1000 });
    }, []);

    useEffect(() => {
        if (students.length > 3) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % students.length);
            }, 3000);
            return () => clearInterval(interval);
        }
        else {

        }
    }, [students.length]);

    return (
        <div>
            <section className='placedStudents' >
                <div className="container" data-aos="slide-up">
                    <div className="row pt-5 mb-5">
                        <div className="col-lg-6 col-sm-12">
                            <h2 className='text-white fw-bold'>OUR PLACED STUDENTS</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Carousel
                                className="custom-carousel"
                                showArrows={true}
                                showThumbs={false}
                                showStatus={false}
                                infiniteLoop={true}
                                emulateTouch={false}
                                showIndicators={false}
                                selectedItem={currentIndex}
                                dynamicHeight={false}
                                swipeable={true}
                                centerMode={true}
                                centerSlidePercentage={33.33}
                                slidesToShow={3}
                                width="100%"
                                interval={0}
                                responsive={[
                                    {
                                        breakpoint: 576,
                                        settings: {
                                            slidesToShow: 1, // Display one item in a row on small screens
                                            centerMode: false,
                                            swipeable: true,
                                            centerSlidePercentage:100,
                                            width:"100%"
                                        },
                                    },
                                    {
                                        breakpoint: 768,
                                        settings: {
                                            slidesToShow: 2, // Display two items in a row on medium screens
                                            centerMode: true,
                                            centerSlidePercentage: 100,
                                            width:"100%"
                                        },
                                    },
                                    {
                                        breakpoint: 992,
                                        settings: {
                                            slidesToShow: 3, // Display three items in a row on larger screens
                                            centerMode: true,
                                            centerSlidePercentage: 30,
                                        },
                                    },
                                    {
                                        breakpoint: 1200,
                                        settings: {
                                            slidesToShow: 4, // Display four items in a row on extra-large screens
                                            centerMode: true,
                                            centerSlidePercentage: 25,
                                        },
                                    },
                                ]}
                            >
                                {students.map((student, index) => (
                                    <div key={index} className="carousel-card text-white">
                                        <div className=" ">
                                            <img src={student.compimg} className="card-img-top st-img" alt="..." />
                                            <div className="card-body">
                                                <h6 className="card-title fw-bold" style={{ textTransform: 'uppercase' }}>{student.studentname}</h6>
                                                <h6 className="badge" style={{ fontStyle: 'italic' }}>{student.branch}</h6> <br />
                                                <h5 className='badge bg-secondary fs-5' style={{ boxShadow: "0 0 20px 1px black" }}>{student.companyname}</h5>
                                                <h6 className=' ' style={{ fontStyle: "italic" }}><span className='' style={{ fontStyle: "italic" }}>Package : </span>{student.ctc}</h6>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PlacedStudent