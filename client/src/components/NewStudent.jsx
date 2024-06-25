import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, InputGroup, Row, Alert } from 'react-bootstrap';

export default function NewStudent() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [validated, setValidated] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    const navigate = useNavigate();

    const handleStudentCreation = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/student/newStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstname, lastname, email, company })
            });

            const result = await response.json();
            console.log(result);
            if (result.success) {
                setAlert({ show: true, message: 'Created new student!', variant: 'success' });
                navigate('/admin/dashboard');
            } else {
                setAlert({ show: true, message: 'Unsuccessful, please try again later :(', variant: 'danger' });
            }
        } catch (error) {
            console.error('Error registering student:', error);
            setAlert({ show: true, message: 'Failed to register student. Please try again later.', variant: 'danger' });
        }
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleStudentCreation} className='registrationContainer'>
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
                <Form.Label>Company</Form.Label>
                    <InputGroup className='registrationInput'>
                        <Form.Control
                            type="text"
                            placeholder="Company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Enter a Username
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
                        <Button className="mainButton registrationBottomBtn" variant="outline-info" size="lg" href="/admin/dashboard">
                            Return to Dashboard
                        </Button>
                    </Col>
                    <Col className="text-center">
                        <Button className="mainButton registrationBottomBtn" type="submit" variant="outline-warning" size="lg">
                            Create Student
                        </Button>
                    </Col>
                </Row>
            </div>
        </Form>
    )
}