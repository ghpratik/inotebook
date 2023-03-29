import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { host } from '../App';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        props.setProgress(0);
        e.preventDefault();
        props.setProgress(30);
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        props.setProgress(50);
        const json = await response.json()
        props.setProgress(70);
        if (json.success) {
            //save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged In Successfully", "success");
            props.setProgress(100);
            navigate("/");
        } else {
            props.showAlert("Invalid Credentials", "danger");
            props.setProgress(100);
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    //EYE ICON MECHANISM
    const password = document.querySelector('#password');
    const eye = document.querySelector('#eye');
    const togglePassword = () => {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        const className = eye.getAttribute('class') === 'fa-solid fa-eye' ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        eye.setAttribute('class', className);
    }


    return (
        <div className="container d-flex justify-content-center">
            <div style={{ maxWidth: '700px' }} className="w-100">
                <h2 className="text-primary">Login to iNotebook</h2>
                <form onSubmit={handleSubmit} className="border border-primary rounded px-5 py-3 d-flex flex-column">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} value={credentials.email} />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="d-flex align-items-center">
                            <input type="password" className="form-control" name="password" id="password" onChange={onChange} value={credentials.password} />
                            <i className="fa-solid fa-eye" id="eye" style={{ cursor: 'pointer', marginLeft: '-30px' }} onClick={togglePassword}></i>
                        </div>
                    </div>
                    <div className="md-3">
                        <button type="submit" className="btn btn-primary me-3">Login</button>
                        <Link to="/forgotPass" className="text-decoration-none text-light"><button className="btn btn-secondary me-3">Forgot Password</button></Link>
                        <Link to="/signup">Don't have an account?</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
