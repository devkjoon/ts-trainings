import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, InputGroup, Alert, Row, Col, Spinner } from 'react-bootstrap';
import API_URL from '../../config';
import '../../assets/css/AdminPreLogin.css';

export default function AdminRegistration() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, email, username, password, adminCode }),
      });

      const result = await response.json();
      console.log(result);
      if (result.success) {
        setAlert({ show: true, message: 'Registration successful!', variant: 'success' });
        navigate('/admin/login');
      } else {
        setAlert({
          show: true,
          message: 'Unsuccessful, please try again later :(',
          variant: 'danger',
        });
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setAlert({
        show: true,
        message: 'Failed to register user. Please try again later.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <Form noValidate validated={validated} onSubmit={handleRegistration} className="admin-form">
        <h2 className="admin-title">Administrator Registration</h2>
        <Row>
          <Col md={6}>
            <Form.Group className="admin-input-group">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="admin-input-group">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="admin-input-group">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="admin-input-group">
              <Form.Label>Username</Form.Label>
              <InputGroup>
                <InputGroup.Text>@</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="admin-input-group">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="admin-input-group">
              <Form.Label>Admin Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Admin Code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <div className="admin-button-container">
          <Link to="/" className="admin-button" style={{ textDecoration: 'none' }}>
            <Button variant="outline-secondary" size="lg" className="w-100">
              Return Home
            </Button>
          </Link>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            className="admin-button"
            disabled={loading}
          >
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Register'
            )}
          </Button>
          <Link to="/admin/login" className="admin-link-button">
            <Button variant="link" className="w-100 no-underline">
              Already have an account? Login here
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
}
