import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Navbar.css';

const TopNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();

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

    const handleDashboardClick = () => {
        if (userType === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/student/dashboard');
        }
    };

    return (
        <Container>
            <Navbar className='navbar navbar-expand-lg navbar-light bg-transparent border border-info p-3 navbarMain'>
                <Container className='navbarSection'>
                    <Navbar.Brand className='text-warning'>
                        Think Safety Trainings
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav" className='justify-content-end'>
                        <Nav>
                            {isLoggedIn ? (
                                <>
                                    <Nav.Link>
                                        <Button variant="outline-warning" size='lg' onClick={handleDashboardClick}>
                                            Dashboard
                                        </Button>
                                    </Nav.Link>
                                    <Nav.Link>
                                        <Button variant='outline-warning' size='lg' onClick={handleLogout}>
                                            Log Out
                                        </Button>
                                    </Nav.Link>
                                </>
                            ) : (
                                <Nav.Link>
                                    <Button variant="outline-warning" size='lg' href='/student/login'>Student Log In</Button>
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    );
};

export default TopNavbar;
