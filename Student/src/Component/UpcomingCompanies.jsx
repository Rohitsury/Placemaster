import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function UpcomingCompanies() {
    const [compdata, setCompdata] = useState([]);
    const [companies, setCompanies] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);

    const getData = async () => {
        try {
            const res = await fetch('http://localhost:5000/admin/companies', {
                method: 'GET',
            });
            const data = await res.json();

            let filteredData = data.filter((item) => {
                const currentDate = new Date().setHours(0, 0, 0, 0);
                const driveDate = new Date(item.drivedate).setHours(0, 0, 0, 0);
                return driveDate >= currentDate;
            });

            setCompdata(filteredData);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        console.log(compdata.length)
        if (compdata.length > 3) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    return nextIndex >= compdata.length ? 0 : nextIndex;
                });
            }, 3000);
    
            return () => clearInterval(interval);
        }
    }, [compdata.length]);

    let carouselComponent;

    if (compdata.length === 0) {
        carouselComponent = (
            <div className='d-flex justify-content-center mt-5'>
            <h2 className='text-secondary fw-light'>No Upcoming Companies Found, Stay Tuned!</h2>
            </div>
        );
    }
    else if (compdata.length === 1) {
        carouselComponent = (
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
                centerSlidePercentage={100}
                slidesToShow={1}
                width="100%"
                interval={3000}
                responsive={[
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1, // Display one item in a row on small screens
                            centerMode: false,
                            swipeable: true,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2, // Display two items in a row on medium screens
                            centerMode: true,
                            centerSlidePercentage: 30,
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
                ]}
            >
                {compdata.map((company, index) => (
                    <div key={index} className="carousel-card text-white">
                        <div className="p-5">
                            <div className='  d-flex justify-content-center' style={{ height: '150px' }}>
                               <NavLink to="/drives"><img src={company.compimg} className=" card-img-top compimg" alt="..." style={{ width: "180px", }} /></NavLink> 
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        );
    }
    else if (compdata.length === 2) {
        carouselComponent = (
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
                centerSlidePercentage={50}
                slidesToShow={2}
                width="100%"
                interval={3000}
                responsive={[
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1, // Display one item in a row on small screens
                            centerMode: false,
                            swipeable: true,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2, // Display two items in a row on medium screens
                            centerMode: true,
                            centerSlidePercentage: 30,
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
                ]}
            >
                {compdata.map((company, index) => (
                    <div key={index} className="carousel-card text-white">
                        <div className="p-5">
                            <div className='  d-flex justify-content-center' style={{ height: '150px' }}>
                               <NavLink to="/drives"> <img src={company.compimg} className=" card-img-top compimg" alt="..." style={{ width: "180px", }} /></NavLink>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        );
    }
    else if (compdata.length === 3) {
        carouselComponent = (
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
                interval={3000}
                responsive={[
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1, // Display one item in a row on small screens
                            centerMode: false,
                            swipeable: true,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2, // Display two items in a row on medium screens
                            centerMode: true,
                            centerSlidePercentage: 30,
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
                ]}
            >
                {compdata.map((company, index) => (
                    <div key={index} className="carousel-card text-white">
                        <div className="p-5">
                            <div className='  d-flex justify-content-center' style={{ height: '150px' }}>
                               <NavLink to="/drives"> <img src={company.compimg} className=" card-img-top compimg" alt="..." style={{ width: "180px", }} /></NavLink>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        );
    }

    else if (compdata.length === 4) {
        carouselComponent = (
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
                centerSlidePercentage={25}
                slidesToShow={4}
                width="100%"
                interval={3000}
                responsive={[
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1, // Display one item in a row on small screens
                            centerMode: false,
                            swipeable: true,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2, // Display two items in a row on medium screens
                            centerMode: true,
                            centerSlidePercentage: 30,
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
                ]}
            >
                {compdata.map((company, index) => (
                    <div key={index} className="carousel-card text-white">
                        <div className="p-5">
                            <div className='  d-flex justify-content-center' style={{ height: '150px' }}>
                               <NavLink to="/drives"> <img src={company.compimg} className=" card-img-top compimg" alt="..." style={{ width: "180px", }} /> </NavLink>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        );
    }
    else {
        carouselComponent = (
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
                centerSlidePercentage={25}
                slidesToShow={4}
                width="100%"
                interval={3000}
                responsive={[
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1, // Display one item in a row on small screens
                            centerMode: false,
                            swipeable: true,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2, // Display two items in a row on medium screens
                            centerMode: true,
                            centerSlidePercentage: 30,
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
                ]}
            >
                {compdata.map((company, index) => (
                    <div key={index} className="carousel-card text-white">
                        <div className="p-5">
                            <div className='  d-flex justify-content-center' style={{ height: '80px' }}>
                               <NavLink to="/drives"> <img src={company.compimg} className=" card-img-top compimg" alt="..." style={{ width: "180px", height:"100px" }} /></NavLink>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        );
    }

    return (
        <>
            {carouselComponent}

            <style>
                {`
                    
                    
                `}
            </style>
        </>
    )
}

export default UpcomingCompanies