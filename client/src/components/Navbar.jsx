import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/Navbar.css';

const TopNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserType = localStorage.getItem('userType');
        if (token) {
            setIsLoggedIn(true);
            setUserType(storedUserType);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleDashboard = () => {
        if (userType === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/student/dashboard');
        }
    };

    const hiddenRoutes = ['/', '/admin', '/admin/registration', '/admin/login', '/student/login'];
    const isHiddenRoute = hiddenRoutes.includes(location.pathname);

    return (
        <Navbar expand="lg" className='navbar navbar-expand-lg navbar-light bg-transparent border border-info navbarMain'>
            
                <Navbar.Brand className='text-warning navbar-title'>
                    Think Safety Trainings
                </Navbar.Brand>
                {isLoggedIn && !isHiddenRoute && (
                    <>
                        <Navbar.Toggle aria-controls="offcanvasNavbar" className='justify-content-end burger-menu' />
                        <Navbar.Offcanvas
                            id="offcanvasNavbar"
                            aria-labelledby="offcanvasNavbarLabel"
                            placement="end">
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id="offcanvasNavbarLabel">
                                    Think Safety Trainings
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link>
                                        <Button variant="outline-warning" size='lg' onClick={handleDashboard}>
                                            Dashboard
                                        </Button>
                                    </Nav.Link>
                                    <Nav.Link>
                                        <Button variant='outline-warning' size='lg' onClick={handleLogout}>
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

export default TopNavbar;
