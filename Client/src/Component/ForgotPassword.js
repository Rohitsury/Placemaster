import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router';

function ForgotPassword({ close }) {
    let navigate = useNavigate()
    const [frtuserid, setFrtUserid] = useState('');
    const [frtpassword, setFrtPassword] = useState('');
    const [key, setKey] = useState('');
    const handlePassword = async (e) => {
        e.preventDefault();
        const reset = {
            password: frtpassword,
            key: key

        };
        try {
            const res = await fetch(`http://localhost:5000/admin/forgotpassword/${frtuserid}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reset)
            })
            if (res.status === 200) {
                alert("Password Reset Succesfully")
                window.location.reload();
            }
            if (res.status === 400) {
                alert("Invalid key")
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <div className='separate-div' >
                <div className="separate-div-content" style={{ width: "40%", height: "40%" }}>
                    <nav class="navbar frgnavbar  justify-content-between">
                        <h5 class="fw-bold" style={{ color: "#ff0080" }}> Forgot Password</h5>

                        <button className="close-btn my-2 my-sm-0 " onClick={close}> <CloseIcon />  </button>
                    </nav>
                    <form onSubmit={handlePassword}>
                        <center>
                            <div class="form-group">
                                <input type="text" class="form-control  w-50" id="exampleInputEmail1" aria-describedby="emailHelp" value={frtuserid} onChange={(e) => setFrtUserid(e.target.value)} placeholder="Enter User ID" />

                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control my-3 w-50" id="exampleInputEmail1" aria-describedby="emailHelp" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter key " />

                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control my-3 w-50" id="exampleInputPassword1" placeholder="Enter New Password"
                                    value={frtpassword} onChange={(e) => setFrtPassword(e.target.value)} />
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                                <label class="form-check-label" for="exampleCheck1">Check me out</label>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </center>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword