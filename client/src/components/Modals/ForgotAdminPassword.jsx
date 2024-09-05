import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import API_URL from '../../config';

export default function ForgotAdminPassword({ show, handleClose }) {
  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setAlert({
          show: true,
          message: 'A password reset link has been sent to your email.',
          variant: 'success',
        });
        setEmail(''); // Clear the email input after success
        setValidated(false); // Reset the form validation state
      } else {
        setAlert({
          show: true,
          message: result.message || 'Failed to send password reset link.',
          variant: 'danger',
        });
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
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
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <Form noValidate validated={validated} onSubmit={handlePasswordReset}>
          <Form.Group controlId="formEmail">
            <Form.Label>Enter your registered email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="outline-primary"
          type="submit"
          disabled={loading}
          onClick={handlePasswordReset}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
