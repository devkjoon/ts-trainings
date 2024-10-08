import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import API_URL from '../../config';
import '../../assets/css/AdminPreLogin.css';

export default function AdminPasswordReset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ show: true, message: 'Passwords do not match.', variant: 'danger' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAlert({
          show: true,
          message: errorData.message || 'Failed to reset password.',
          variant: 'danger',
        });
        return;
      }

      setAlert({ show: true, message: 'Password reset successfully.', variant: 'success' });
      navigate('/admin/login');
    } catch (error) {
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
      <Form noValidate validated={validated} onSubmit={handlePasswordReset} className="admin-form">
        <h2 className="admin-title">Reset Password</h2>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <Form.Group className="admin-input-group">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter a new password.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="admin-input-group">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please confirm your new password.
          </Form.Control.Feedback>
        </Form.Group>
        <div className="admin-button-container">
          <Button
            variant="outline-primary"
            type="submit"
            disabled={loading}
            className="admin-button"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
          <Link to="/admin/login" className="admin-button" style={{ textDecoration: 'none' }}>
            <Button variant="outline-secondary" className="w-100">
              Back to Login
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
}
