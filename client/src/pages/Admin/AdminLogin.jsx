import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, InputGroup, Alert } from 'react-bootstrap';
import ForgotAdminPassword from '../../components/Modals/ForgotAdminPassword';
import API_URL from '../../config';
import '../../assets/css/AdminPreLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

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

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userType', 'admin');
        navigate('/admin/dashboard');
      } else {
        setAlert({
          show: true,
          message: 'Invalid credentials. Please try again.',
          variant: 'danger',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlert({
        show: true,
        message: 'An error occurred. Please try again later.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <Form noValidate validated={validated} onSubmit={handleLogin} className="admin-form">
        <h2 className="admin-title">Administrator Login</h2>
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
        <div className="text-end mb-3">
          <Link to="#" onClick={() => setShowForgotPasswordModal(true)}>
            Forgot Password?
          </Link>
        </div>
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Link to="/admin/registration" className="admin-link-button">
            <Button variant="link" className="w-100 no-underline">
              Don't have an account? Register here
            </Button>
          </Link>
        </div>
      </Form>
      <ForgotAdminPassword
        show={showForgotPasswordModal}
        handleClose={() => setShowForgotPasswordModal(false)}
        showAlert={setAlert}
      />
    </div>
  );
}
