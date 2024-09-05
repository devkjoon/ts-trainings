import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, InputGroup, Alert } from 'react-bootstrap';
import StudentLoginCode from '../../components/Modals/StudentLogin/StudentLoginCode';
import API_URL from '../../config';
import '../../assets/css/StudentPreLogin.css';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);
  const [showStudentLoginCodeModal, setShowStudentLoginCodeModal] = useState(false);

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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, loginCode }),
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userType', 'student');
        localStorage.setItem('studentId', result.userId);
        navigate('/student/dashboard');
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
    <div className="student-container">
      <Form noValidate validated={validated} onSubmit={handleLogin} className="student-form">
        <h2 className="student-title">Student Login</h2>
        <Form.Group className="student-input-group">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="student-input-group">
          <Form.Label>Login Code</Form.Label>
          <Form.Control
            type="tel"
            pattern="\d{6}"
            placeholder="Login Code"
            value={loginCode}
            onChange={(e) => setLoginCode(e.target.value)}
            required
          />
        </Form.Group>
        <div className="text-end mb-3">
          <Link to="#" onClick={() => setShowStudentLoginCodeModal(true)}>
            Forgot Login Code?
          </Link>
        </div>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <div className="student-button-container">
          <Link to="/" className="student-button" style={{ textDecoration: 'none' }}>
            <Button variant="outline-secondary" size="lg" className="w-100">
              Return Home
            </Button>
          </Link>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            className="student-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </Form>
      <StudentLoginCode
        show={showStudentLoginCodeModal}
        handleClose={() => setShowStudentLoginCodeModal(false)}
      />
    </div>
  );
}
