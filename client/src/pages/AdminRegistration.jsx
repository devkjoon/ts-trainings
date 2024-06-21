import React from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';

import '../assets/css/AdminRegistration.css';

export default function AdminRegistration() {
    return (
        <Form className='registrationContainer'>
            <Row>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>First Name</Form.Label>
                    <InputGroup className='registrationInput'>
                        <Form.Control
                            type="text"
                            placeholder="first name"
                            /* value={firstname} */
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a first name
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>Last Name</Form.Label>
                    <InputGroup className='registrationInput'>
                        <Form.Control
                            type="text"
                            placeholder="last name"
                            /* value={lastname} */
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a last name
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
                            placeholder="email"
                            /* value={email} */
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter an email
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>Username</Form.Label>
                    <InputGroup className='registrationInput'>
                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="username"
                            /* value={username} */
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a last name
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
                            placeholder="password"
                            /* value={password} */
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a first name
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" className='mb-2 mt-2'>
                <Form.Label>Admin Code</Form.Label>
                    <InputGroup className='registrationInput'>
                        <Form.Control
                            type="text"
                            placeholder="admin code"
                            /* value={adminCode} */
                            onChange={(e) => setAdminCode(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a last name
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Row>
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