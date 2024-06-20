import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, InputGroup, Row, Alert } from 'react-bootstrap';

import '../assets/css/AdminLogin.css';

import './AdminRegistration';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        console.log('Submitting login form with:', { username, password });
        
        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            console.log('Login response:', result);

            if (result.message === "Logged In") {
                setAlert({ show: true, message: 'Login successful!', variant: 'success' });
                navigate('/Admin');
            } else {
                setAlert({ show: true, message: 'Invalid credentials. Please try again.', variant: 'danger' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setAlert({ show: true, message: 'An error occurred. Please try again later.', variant: 'danger' });
        }
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleLogin} className="formContainer">
            <Row className="mb-2">
                <Form.Group as={Col} md="6">
                    <Form.Label>Username</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            aria-describedby="inputGroupPrepend"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a username
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Enter a password
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <div className='loginButtonContainer'>
                <Row>
                    <Col className="text-center">
                        <Button className="mainButton mt-3" variant="outline-info" size="lg" href="/AdminRegistration">
                            Register Instead
                        </Button>
                    </Col>
                    <Col className="text-center">
                        <Button className="mainButton mt-3" type="submit" variant="outline-warning" size="lg">
                            Login
                        </Button>
                    </Col>
                </Row>
            </div>
        </Form>
    );
};

export default AdminLogin;
