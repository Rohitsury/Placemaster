import React, { useState, useEffect } from 'react'
import Navbar from '../Component/Navbar'

function Videos() {
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
      <Navbar />

      <section className='text-white' style={{backgroundColor:'rgb(30, 30, 31,.9)', height:'90.9vh'}}>
        <div className="container">
        <div className="row">
          {
            video.map((videos, index) => (
              <>
                
                  <div className="col-3">
                    <video width="320" height="240" controls>
                      <source src={videos.video} type="video/mp4" />
                    </video>
                    <h4 className='ms-0'>{videos.title}</h4>
                    <span>{videos.caption}</span>
                  </div>
              

              </>
            ))
          }
            </div>
        </div>
      </section>

    </>
  )
}

export default Videos