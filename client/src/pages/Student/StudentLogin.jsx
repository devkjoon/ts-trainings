import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Col, Form, InputGroup, Row, Alert } from 'react-bootstrap'

import API_URL from '../../config';

import '../../assets/css/Login.css';

export default function StudentLogin() {
    const [email, setEmail] = useState('');
    const [loginCode, setLoginCode] = useState('');
    const [validated, setValidated] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setLoading(true);

        console.log('Submitting login form with:', { email, loginCode });

        try {
            const response = await fetch(`${API_URL}/student/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, loginCode })
            });

        const result = await response.json();

        if (result.token) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('userType', 'student');
            localStorage.setItem('studentId', result.userId);
            navigate('/student/dashboard');
        } else {
            setAlert({ show: true, message: 'Invalid credentials. Please try again.', variant: 'danger' });
        }
    } catch (error) {
        console.error('Login error:', error);
        setAlert({ show: true, message: 'An error occurred. Please try again later.', variant: 'danger' });
    } finally {
        setLoading(false);
    }
};


    return (
        <Form noValidate validated={validated} onSubmit={handleLogin} className="formContainer">
            <Row className="mb-2">
                <Form.Group as={Col} md="6" sm="8" className='mt-3'>
                    <Form.Label>Email</Form.Label>
                    <InputGroup hasValidation className='loginInput'>
                        <Form.Control
                            type="text"
                            placeholder="Email"
                            aria-describedby="inputGroupPrepend"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter an email
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" sm="4" controlId="validationCustom01" className='mt-3'>
                    <Form.Label>Login Code</Form.Label>
                        <InputGroup className='loginInput'>
                        <Form.Control
                            type="text"
                            placeholder="Login Code"
                            value={loginCode}
                            onChange={(e) => setLoginCode(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a login code
                        </Form.Control.Feedback>
                        </InputGroup>
                </Form.Group>
            </Row>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <div className='login-btn-container'>
                <Row>
                    <Col className="text-center">
                        <Link to='/' className='no-underline'>
                            <Button className="login-btn mt-3" variant="outline-info" size="lg">
                                Return Home
                            </Button>
                        </Link>
                    </Col>
                    <Col className="text-center">
                        <Button className="login-btn mt-3" type="submit" variant="outline-warning" size="lg" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Col>
                </Row>
            </div>
        </Form>
    );
};

