import React, { useState, useEffect } from 'react';
import Sidebar from '../Component/Sidebar';
import DashboardNavbar from '../Component/DashboardNavbar';

function Video() {

    const [video, setVideo] = useState([])
    const getVideo = async () => {
        try {
            const res = await fetch('http://localhost:5000/admin/videos', {
                method: 'GET',
            });
            const data = await res.json();
            setVideo(data);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getVideo()
    }, [])

    return (
        <>
            {/* {isLoading ? (

        <section style={{ color: 'white', height: '0', }}>
          <div className="text-center d-flex justify-content-center">
            <div className="spinner-border text-primary" style={{ marginTop: '20%' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </section>

      ) : null} */}

            <section>
                <div className="row">
                    <Sidebar />
                    <div className="col-lg-10 two">
                        {/* Navbar */}
                        <DashboardNavbar />
                        {/* END NAVBAR */}
                        <h4 className='mt-2'>All Videos</h4>
                        <div className="row">
                            {video.map((videos, index) => (
                                <div key={index} className="col-4">
                                    <video width="320" height="240" controls>
                                        <source src={videos.video} type="video/mp4" />
                                    </video>
                                    <h4 className='ms-0'>{videos.title}</h4>
                                    <span>{videos.caption}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>



            <style>
                {`
              @import url('https://fonts.googleapis.com/css?family=Sofia:400,500,600,700&display=swap');

                .placemaster{
                    letter-spacing:1px;
                    font-family:Sofia
                }
                .box {
                  margin:10px 20px;
                  margin-top:30px;
                }
                /*==================================================
                 * Effect 1
                 * ===============================================*/
                .effect1{
                  border-radius:50px
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
    )
}

export default Video

// function converToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result)
//     };
//     fileReader.onerror = (error) => {
//       reject(error)
//     }
//   })
// }


