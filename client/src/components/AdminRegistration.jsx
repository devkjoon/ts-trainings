import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, InputGroup, Row, Alert } from 'react-bootstrap';

import '../assets/css/AdminRegistration.css';

export default function AdminRegistration() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [validated, setValidated] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    const navigate = useNavigate();

    const handleRegistration = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/admin/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstname, lastname, email, username, password, adminCode })
            });

            const result = await response.json();
            console.log(result);
            if (result.success) {
                setAlert({ show: true, message: 'Registration successful!', variant: 'success' });
                navigate('/admin/login');
            } else {
                setAlert({ show: true, message: 'Unsuccessful, please try again later :(', variant: 'danger' });
                console.log(result.message)
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setAlert({ show: true, message: 'Failed to register user. Please try again later.', variant: 'danger' });
        }
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleRegistration} className='registrationContainer'>
            <Row>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>First Name</Form.Label>
                    <InputGroup className='registrationInput'>
                        <Form.Control
                            type="text"
                            placeholder="First Name"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a First Name
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>Last Name</Form.Label>
                    <InputGroup className='registrationInput'>
                        <Form.Control
                            type="text"
                            placeholder="Last Name"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a Last Name
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>Email</Form.Label>
                    <InputGroup className='registrationInput'>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter an Email
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>Username</Form.Label>
                    <InputGroup className='registrationInput'>
                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a Username
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>Set Password</Form.Label>
                    <InputGroup className='registrationInput'>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a Password
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>Admin Code</Form.Label>
                    <InputGroup className='registrationInput'>
                        <Form.Control
                            type="text"
                            placeholder="Admin Code"
                            value={adminCode}
                            onChange={(e) => setAdminCode(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter an Admin Code
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
                        <Button className="mainButton registrationBottomBtn" variant="outline-info" size="lg" href="/">
                            Return Home
                        </Button>
                    </Col>
                    <Col className="text-center">
                        <Button className="mainButton registrationBottomBtn" type="submit" variant="outline-warning" size="lg">
                            Complete Registration
                        </Button>
                    </Col>
                </Row>
            </div>
        </Form>
    )
}