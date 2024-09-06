import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert, InputGroup } from 'react-bootstrap';
import API_URL from '../../config';
import '../../assets/css/VerifyCertification.css';

const VerifyCertification = ({ show, handleClose }) => {
  const [certificationNumber, setCertificationNumber] = useState('');
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!certificationNumber) {
      setAlert({
        show: true,
        message: 'Please enter a reference number.',
        variant: 'danger',
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setResult(null);
    setAlert({ show: false, message: '', variant: '' });

    try {
      const response = await fetch(
        `${API_URL}/certification/verify?certificationNumber=TS-${certificationNumber}`
      );
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setAlert({
          show: true,
          message: data.message || 'Invalid certification number.',
          variant: 'danger',
        });
      }
    } catch (err) {
      setAlert({
        show: true,
        message: 'An error occurred. Please try again.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setCertificationNumber('');
    setValidated(false);
    setAlert({ show: false, message: '', variant: '' });
    setResult(null);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered className="verify-certification-modal">
      <Modal.Header closeButton>
        <Modal.Title>Verify Certification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} noValidate validated={validated}>
          <Form.Group controlId="certificationNumber">
            <Form.Label>Reference ID</Form.Label>
            <InputGroup>
              <InputGroup.Text>TS-</InputGroup.Text>
              <Form.Control
                type="tel"
                value={certificationNumber}
                onChange={(e) => setCertificationNumber(e.target.value)}
                placeholder="Enter reference ID"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a reference ID.
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">
              Enter the reference ID without the "TS-" prefix.
            </Form.Text>
          </Form.Group>

          {result && (
            <div className="mt-4 certification-result">
              <h4>Certification Verified</h4>
              <p><strong>Student Name:</strong> {result.studentName}</p>
              <p><strong>Course Name:</strong> {result.courseName}</p>
              <p><strong>Completion Date:</strong> {new Date(result.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          )}

          {alert.show && (
            <Alert
              variant={alert.variant}
              onClose={() => setAlert({ show: false })}
              dismissible
              className="mt-3"
            >
              {alert.message}
            </Alert>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button
          variant="outline-info"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Verify'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VerifyCertification;
