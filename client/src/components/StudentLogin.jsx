import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, InputGroup, Row, Alert } from 'react-bootstrap';

import '../assets/css/AdminLogin.css';
import '../pages/Dashboard';

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
            const response = await fetch('http://localhost:5000/student/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, loginCode })
            });

        const result = await response.json();

        if (result.message === "Logged In") {
            setAlert({ show: true, message: 'Login successful!', variant: 'success' });
            navigate('/Dashboard');
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
                <Form.Group as={Col} md="6">
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
                <Form.Group as={Col} md="6" controlId="validationCustom01">
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
            <div className='loginButtonContainer'>
                <Row>
                    <Col className="text-center">
                        <Button className="mainButton mt-3" variant="outline-info" size="lg" href="/">
                            Return Home
                        </Button>
                    </Col>
                    <Col className="text-center">
                        <Button className="mainButton mt-3" type="submit" variant="outline-warning" size="lg" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Col>
                </Row>
            </div>
        </Form>
    );
};

