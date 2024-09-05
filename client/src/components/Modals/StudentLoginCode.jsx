import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import API_URL from '../../config';

export default function StudentLoginCode({ show, handleClose }) {
  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);

  const requestLoginCode = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/student/request-login-code`, {
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
          message:
            'If an account is associated with the email provided, a login code will be sent to that email.',
          variant: 'success',
        });
        setEmail('');
        setValidated(false);
      } else {
        setAlert({
          show: true,
          message: result.message || 'Failed to send login code.',
          variant: 'danger',
        });
      }
    } catch (error) {
      console.error('Error sending login code:', error);
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
        <Modal.Title>Forgot Login Code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <Form noValidate validated={validated} onSubmit={requestLoginCode}>
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
          onClick={requestLoginCode}
        >
          {loading ? 'Sending...' : 'Send Login Code'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
