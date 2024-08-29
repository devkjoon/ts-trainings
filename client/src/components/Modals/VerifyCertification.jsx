import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import API_URL from '../../config';

const VerifyCertification ({ show, handleClose }) => {
    const [certificationNumber, setCertificationNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setResult(null);
  
      try {
        const response = await fetch(`${API_URL}/verify-certification?certificationNumber=${certificationNumber}`);
        const data = await response.json();
  
        if (response.ok) {
          setResult(data);
        } else {
          setError(data.message || 'Invalid certification number.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify Certification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="certificationNumber">
              <Form.Label>Certification Number</Form.Label>
              <Form.Control
                type="text"
                value={certificationNumber}
                onChange={(e) => setCertificationNumber(e.target.value)}
                placeholder="Enter certification number"
                required
              />
            </Form.Group>
            <Button variant="outline-info" type="submit" className="mt-3" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Verify'}
            </Button>
          </Form>
  
          {result && (
            <Alert variant="success" className="mt-4">
              <h4>Certification Verified</h4>
              <p><strong>Student Name:</strong> {result.studentName}</p>
              <p><strong>Course Name:</strong> {result.courseName}</p>
              <p><strong>Completion Date:</strong> {new Date(result.completionDate).toLocaleDateString()}</p>
            </Alert>
          )}
  
          {error && (
            <Alert variant="danger" className="mt-4">
              {error}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  export default VerifyCertification