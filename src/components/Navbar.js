import React from 'react'
import { Link, useLocation } from  "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import noteContext from '../context/notes/noteContext';
import logo from '../assets/logo.png'

const Navbar = (props) => {
    const context = useContext(noteContext);
    const { userData } = context; //De-strucure karna bolte hai isko
    const {setProgress} = props;
    let location = useLocation();
    let navigate = useNavigate();
    const handleLogout = ()=>{
        setProgress(30);
        localStorage.removeItem('token')
        setProgress(100);
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"><img src={logo} alt="logo" className="img-fluid" style={{maxWidth: '200px'}}></img></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/"?'active':''}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/about"?'active':''}`} to="/about">About</Link>
                        </li>
                    </ul>
                    {!localStorage.getItem('token') ?
                    <form className="d-flex" role="search">
                        <Link className="btn btn-success mx-1 btn-sm" to="/login" role="button">Login</Link>
                        <Link className="btn btn-primary mx-1 btn-sm" to="/signup" role="button">SignUp</Link>
                    </form>: <div><button type="button" className="btn btn-success btn-sm"><i className="fa-regular fa-circle-user"></i> {userData.name}</button><button onClick={handleLogout} className="btn btn-danger ms-2 btn-sm">Logout</button></div>}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
