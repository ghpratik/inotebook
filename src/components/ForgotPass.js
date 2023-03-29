import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { host } from '../App';

var verify = "";

const ForgotPass = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "", confirmPassword: "" })
    const { name, email, password, confirmPassword } = credentials;
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        props.setProgress(30);
        e.preventDefault();
        var inputOTP = document.getElementById('otp').value;
        if (inputOTP === verify) {
            if (password === confirmPassword) {
                props.setProgress(50);
                const response = await fetch(`${host}/api/auth/forgotPass`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: credentials.email, password: credentials.password })
                });
                props.setProgress(70);
                const json = await response.json()
                if (json.success) {
                    //save the auth token and redirect
                    props.showAlert("Password Changed Successfully", "success");
                    props.setProgress(100);
                    navigate("/login");
                } else {
                    props.setProgress(100);
                    props.showAlert("Invalid Credentials", "danger");
                }
            } else {
                props.setProgress(100);
                props.showAlert("Passwords didn't match!", "danger")
            }
        } else {
            props.setProgress(100);
            props.showAlert("Invalid OTP", "danger")
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const generateOTP = (limit) => {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < limit; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }

    //send otp button
    const sendOTP = async (e) => {
        props.setProgress(30);
        e.preventDefault();
        verify = generateOTP(6);
        props.setProgress(50);
        document.getElementById('otp').removeAttribute("disabled", false);
        // send mail otp
        props.setProgress(70);

        const response = await fetch(`${host}/api/auth/mail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, verify })
        });
        props.setProgress(100);
        props.showAlert("OTP sent on your email", "success");
    }

    //EYE ICON MECHANISM
    const passwordEye = document.querySelector('#password');
    const cpassword = document.querySelector('#cpassword');
    const eye = document.querySelector('#eye');
    const eyeConfirm = document.querySelector('#eyeConfirm');
    const togglePassword = () => {
        const type = passwordEye.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordEye.setAttribute('type', type);
        // toggle the eye slash icon
        const className = eye.getAttribute('class') === 'fa-solid fa-eye' ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        eye.setAttribute('class', className);
    }
    const togglecPassword = () => {
        const type = cpassword.getAttribute('type') === 'password' ? 'text' : 'password';
        cpassword.setAttribute('type', type);
        // toggle the eye slash icon
        const className = eyeConfirm.getAttribute('class') === 'fa-solid fa-eye' ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        eyeConfirm.setAttribute('class', className);
    }

    return (
        <div className="container d-flex justify-content-center">
            <div style={{ maxWidth: '700px' }} className="w-100">
                <h2 className="text-primary">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="border border-primary rounded px-5 py-3 d-flex flex-column">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <div className="d-flex">
                            <input type="email" className="form-control me-3" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} value={credentials.email} />
                            <button className="btn btn-primary text-nowrap" onClick={sendOTP}>Send OTP</button>
                        </div>
                    </div>
                    <div className="mb-3 d-flex align-items-center">
                        <label htmlFor="otp" className="form-label me-3 text-nowrap">Enter OTP :</label>
                        <input type="text" className="form-control me-3" id="otp" name="otp" disabled={true} />
                    </div>
                    <div className="row">
                        <div className="mb-3 col">
                            <label htmlFor="password" className="form-label">Set New Password</label>
                            <div className="d-flex align-items-center">
                                <input type="password" className="form-control" name="password" id="password" onChange={onChange} value={credentials.password} />
                                <i className="fa-solid fa-eye" id="eye" style={{ cursor: 'pointer', marginLeft: '-30px' }} onClick={togglePassword}></i>
                            </div>
                        </div>
                        <div className="mb-3 col">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="d-flex align-items-center">
                                <input type="password" className="form-control" name="confirmPassword" id="cpassword" onChange={onChange} value={credentials.confirmPassword} />
                                <i className="fa-solid fa-eye" id="eyeConfirm" style={{ cursor: 'pointer', marginLeft: '-30px' }} onClick={togglecPassword}></i>
                            </div>
                        </div>
                    </div>
                    <div className="md-3">
                        <button type="submit" className="btn btn-primary me-3">Set Password</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPass
