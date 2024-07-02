import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Navbar.css';

const TopNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <Navbar expand="lg" className='navbar navbar-light bg-transparent border border-info p-3 navbarMain'>
            <Container>
                <Navbar.Brand className='text-warning'>
                    Think Safety Trainings
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
                    <Nav>
                        {isLoggedIn && (
                            <>
                                <Nav.Link href="/dashboard">
                                    <Button variant="outline-warning" size='lg'>Dashboard</Button>
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout}>
                                    <Button variant='outline-warning' size='lg'>Log Out</Button>
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;
