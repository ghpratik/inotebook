import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { host } from '../App';

var verify = "";

const SignUp = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [submitted, setSubmitted] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    props.setProgress(30);
    setSubmitted("clicked");
    e.preventDefault();
    const { name, email, password, confirmPassword } = credentials;
    props.setProgress(50);
    if (password === confirmPassword) {
      verify = generateOTP(6);
      document.getElementById('otpVerify').removeAttribute("disabled", false);
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
      props.showAlert("Enter OTP sent to your E-mail address ", "info");
      setSubmitted("sent");
    } else {
      props.setProgress(100);
      props.showAlert("Password did'nt matched", "danger");
    }
  }

  const handleVerify = async (e) => {
    props.setProgress(30);
    e.preventDefault();
    var inputOTP = document.getElementById('otp').value;
    if (inputOTP === verify) {
      // CREATE USER
      const { name, email, password } = credentials;
      props.setProgress(50);
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });
      props.setProgress(70);
      const json = await response.json()
      if (json.success) {
        //save the auth token and redirect
        localStorage.setItem('token', json.authtoken);
        props.setProgress(100);
        navigate("/");
        props.showAlert("Account Created Successfully", "success");
      } else {
        props.setProgress(100);
        props.showAlert("Invalid Credentials", "danger");
      }
    } else {
      props.setProgress(100);
      props.showAlert("Incorrect OTP", "danger");
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setSubmitted("");
  }

  const generateOTP = (limit) => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < limit; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  const getOTPmsg = (submitted) => {
    var jsx;
    switch (submitted) {
      case "sent":
        jsx = <div id="otpmsg" className="form-text text-success h6 d-flex align-items-center"><i className="fa-solid fa-check" style={{ color: '#5cb85c' }}></i>OTP Sent</div>;
        break;
      default:
        jsx = <div id="otpmsg" className="form-text text-success h6 d-none align-items-center"><i className="fa-solid fa-check" style={{ color: '#5cb85c' }}></i>OTP Sent</div>;
        break;
    }
    return jsx;
  }

  //EYE ICON MECHANISM
  const password = document.querySelector('#password');
  const cpassword = document.querySelector('#confirmPassword');
  const eye = document.querySelector('#eye');
  const eyeConfirm = document.querySelector('#eyeConfirm');
  const togglePassword = () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
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
    <div className="container border border-dark p-3" style={{ maxWidth: '600px' }}>
      <h2 className="text-success">Create an account - iNotebook</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control me-2" id="email" aria-describedby="emailHelp" name="email" onChange={onChange} minLength={5} required />
          <div id="email" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="d-flex align-items-center">
            <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={8} required />
            <i className="fa-solid fa-eye" id="eye" style={{ cursor: 'pointer', marginLeft: '-30px' }} onClick={togglePassword}></i>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <div className="d-flex align-items-center">
            <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" onChange={onChange} minLength={8} required />
            <i className="fa-solid fa-eye" id="eyeConfirm" style={{ cursor: 'pointer', marginLeft: '-30px' }} onClick={togglecPassword}></i>
          </div>
        </div>
        <div className="d-flex">
          <button type="submit" className="btn btn-primary me-2">Create a New Account</button>
          {getOTPmsg(submitted)}

        </div>
      </form>
      <form onSubmit={handleVerify}>
        <div className="mb-3">
          <label htmlFor="otp" className="form-label">Enter OTP</label>
          <input type="text" className="form-control" id="otp" name="otp" inputMode="numeric" disabled={true} required />
        </div>
        <button type="submit" className="btn btn-primary" id="otpVerify" disabled={true}>Verify</button>
      </form>
    </div>
  )
}

export default SignUp
