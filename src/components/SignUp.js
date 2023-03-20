import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { host } from '../App';

const SignUp = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = credentials;
    if (password === confirmPassword) {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });
      const json = await response.json()
      console.log(json)
      if (json.success) {

        //save the auth token and redirect
        localStorage.setItem('token', json.authtoken);
        navigate("/");
        props.showAlert("Account Created Successfully", "success");
      } else {
        props.showAlert("Invalid Credentials", "danger");
      }
    } else {
      props.showAlert("Password did'nt matched", "danger");

    }

  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div className="container border border-dark p-3" style={{maxWidth: '600px'}}>
      <h2 className="text-success">Create an account - iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <div className="d-flex flex-row">
            <input type="email" className="form-control me-2" id="email" aria-describedby="emailHelp" name="email" placeholder="We'll never share your E-mail with anyone else" onChange={onChange} minLength={5} required />
            <button className="btn btn-success text-nowrap me-2">Send OTP</button>
            <input type="text" className="form-control me-2 w-50" id="otpinput" onChange={onChange} placeholder="Enter OTP" required />
            <button className="btn btn-success text-nowrap">Verify</button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={8} required />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" onChange={onChange} minLength={8} required />
        </div>
        <button type="submit" className="btn btn-primary">Create a New Account</button>
      </form>
    </div>
  )
}

export default SignUp
