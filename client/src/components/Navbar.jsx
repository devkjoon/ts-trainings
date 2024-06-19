import React from 'react';

import '../assets/css/Navbar.css'

const TopNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent border border-info p-3 navbarMain">
            <a className="navbar-brand text-warning" href="#">Think Safety Trainings</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link text-warning" href="#home">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-warning" href="#about">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-warning" href="#services">Services</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-warning" href="#contact">Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default TopNavbar;
