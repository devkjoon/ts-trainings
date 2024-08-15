import React, { useEffect, useState } from 'react';
import { Nav, Navbar, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import '../../assets/css/Navbar.css';

const TopNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Function to check login status
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const storedUserType = localStorage.getItem('userType');
            if (token) {
                setIsLoggedIn(true);
                setUserType(storedUserType);
            } else {
                setIsLoggedIn(false);
                setUserType('');
            }
        };

        checkLoginStatus();

        const handleStorageChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [location]); // Re-run the effect when the location changes

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleDashboard = () => {
        if (userType === 'admin') {
            navigate('/admin/dashboard');
        } else if (userType === 'student') {
            navigate('/student/dashboard');
        } else {
            navigate('/');
        }
    };

    const hiddenRoutes = ['/', '/admin', '/admin/registration', '/admin/login', '/student/login'];
    const isHiddenRoute = hiddenRoutes.includes(location.pathname);

    // Define dashboard routes for admin and student
    const dashboardRoutes = {
        admin: '/admin/dashboard',
        student: '/student/dashboard',
    };

    // Check if the current path is a dashboard route
    const isDashboardRoute = location.pathname === dashboardRoutes[userType];

    return (
        <Navbar expand="lg" className='navbar navbar-expand-md navbar-light bg-transparent border border-info navbarMain'>
            <Navbar.Brand className='text-warning navbar-title'>
                Think Safety Trainings
            </Navbar.Brand>
            {isLoggedIn && !isHiddenRoute && (
                <>
                    <Navbar.Toggle aria-controls="offcanvasNavbar" className='justify-content-end burger-menu' />
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                        className="offcanvas-customization">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">
                                Think Safety Trainings
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1">
                                {!isDashboardRoute && (
                                    <Nav.Link className='navbar-anchor'>
                                        <Button variant="outline-warning" onClick={handleDashboard}>
                                            Dashboard
                                        </Button>
                                    </Nav.Link>
                                )}
                                <Nav.Link className='navbar-anchor'>
                                    <Button variant='outline-warning' onClick={handleLogout}>
                                        Log Out
                                    </Button>
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </>
            )}
        </Navbar>
    );
};

export default TopNavbar