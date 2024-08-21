import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';

import API_URL from '../../config';

const EditStudentModal = ({
    show,
    handleClose,
    student,
    handleUpdateStudent,
    showAlert
}) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No authentication token found');
        showAlert('Authentication error. Please log in again.', 'danger');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/company`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized. Please check your authentication.');
          } else {
            throw new Error('Failed to fetch companies');
          }
        }

        const data = await response.json();
        setCompanies(data.companies);
      } catch (error) {
        console.error('Error fetching companies:', error.message);
        showAlert(`Error: ${error.message}`, 'danger');
      }
    };

    if (show) {
      fetchCompanies();
    }
  }, [show, showAlert]);

  useEffect(() => {
    if (student) {
      setFirstname(student.firstname);
      setLastname(student.lastname);
      setEmail(student.email);
      setCompany(student.company);
    }
  }, [student]);

  const handleSave = () => {
    if (typeof handleUpdateStudent === 'function') {
      const updatedStudent = {
        ...student,
        firstname,
        lastname,
        email,
        company,
      };
      handleUpdateStudent(updatedStudent);
    } else {
      console.error('handleUpdateStudent is not a function');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Form.Group as={Col} md="6" className="mb-2">
              <Form.Label>First Name</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="6" className="mb-2">
              <Form.Label>Last Name</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="6" className="mb-2">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="6" className="mb-2">
                <Form.Label>Company</Form.Label>
                <Form.Control
                    as="select"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                >
                    <option value="">Select Company</option>
                    {companies.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                        {comp.name}
                    </option>
                    ))}
                </Form.Control>
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditStudentModal;
 