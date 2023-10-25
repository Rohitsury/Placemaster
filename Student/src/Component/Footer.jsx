import React from 'react'
import CopyrightIcon from '@mui/icons-material/Copyright';
function Footer() {
  return (
    <>
           <section style={{height:'10vh',}}  className=' ' >
            <div className="container">
                <footer className='pb-3 pt-4 d-flex justify-content-center'>
                   
                    <h6 style={{fontSize:'18px' }}> <span style={{color:'black'}}><CopyrightIcon /> Copyright </span>
                    <span className='fw-bold place' style={{color:"black"}}>PLACEMASTER</span> <span>All Rights Reserved</span> </h6>
                </footer>
                </div>
            </section>

            <style>
                {`
                     @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@800&display=swap');

                     h6{
                        font-family: 'times-new-roman'
                     }
                     .place{
                        font-family: 'Raleway', sans-serif;
                        letter-spacing:1px;
                     }
                `}
            </style>
    </>
  )
}

export default Footer