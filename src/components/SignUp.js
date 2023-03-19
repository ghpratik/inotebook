import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { host } from '../App';
const SignUp = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = credentials;
    if(password===confirmPassword){
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
    }else{
      props.showAlert("Password did'nt matched", "danger");

    }
    
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div className="container needs-validation">
      <h2>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name="email" onChange={onChange} minLength={5} required />
          <div id="email" className="form-text">We'll never share your email with anyone else.</div>
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
