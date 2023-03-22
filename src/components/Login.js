import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { host } from '../App';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json()
        console.log(json)
        if (json.success) {
            //save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged In Successfully", "success");
            navigate("/");

        } else {
            props.showAlert("Invalid Credentials", "danger");
        }

    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className="container d-flex justify-content-center">
            <div style={{ maxWidth: '700px' }}>
                <h2 className="text-primary">Login to iNotebook</h2>
                <form onSubmit={handleSubmit} className="border border-primary rounded px-5 py-3 d-flex flex-column">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} value={credentials.email} />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" id="password1" onChange={onChange} value={credentials.password} />
                    </div>
                    <div className="md-3">
                        <button type="submit" className="btn btn-primary me-3">Login</button>
                        <button className="btn btn-secondary me-3">Forgot Password</button>
                        <Link to="/signup">Don't have an account?</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
