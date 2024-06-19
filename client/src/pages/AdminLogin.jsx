import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Alert } from 'react-bootstrap';

import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../utils/validators';
import { useForm } from '../hooks/form-hook';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    const handleLogin = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
            return;
        }

        event.preventDefault();

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            setAlert({ show: true, message: 'Login successful!', variant: 'success' });
            // Redirect to a new page or take any other action
        } else {
            setAlert({ show: true, message: 'Invalid credentials. Please try again.', variant: 'danger' });
        }
    };

    return (
        <>
        <Form noValidate validated={validated} onSubmit={handleLogin}>
            <Row className="mb-3">
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
            <Button type="submit" variant="outline-info" size="lg">Login</Button>{' '}
        </Form>
        </>
    );
};

export default AdminLogin;
