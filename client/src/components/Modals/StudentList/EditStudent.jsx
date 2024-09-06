import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Spinner } from 'react-bootstrap'

import '../../../assets/css/AdminPreLogin.css';

const EditStudentModal = ({
  show,
  handleClose,
  student,
  handleUpdateStudent,
  showAlert,
  companies,
}) => {
  const [firstname, setFirstname] = useState(student.firstname);
  const [lastname, setLastname] = useState(student.lastname);
  const [email, setEmail] = useState(student.email);
  const [company, setCompany] = useState(student.company ? student.company._id : '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update state when student prop changes
    setFirstname(student.firstname);
    setLastname(student.lastname);
    setEmail(student.email);
    setCompany(student.company ? student.company._id : '');
  }, [student]);

  const handleSave = async () => {
    setLoading(true);
    const updatedStudent = {
      ...student,
      firstname,
      lastname,
      email,
      company,
    };
    await handleUpdateStudent(updatedStudent);
    setLoading(false);
  };

  const handleModalClose = () => {
    setFirstname(student.firstname);
    setLastname(student.lastname);
    setEmail(student.email);
    setCompany(student.company ? student.company._id : '');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered className="admin-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="admin-form">
          <Row>
            <Form.Group as={Col} md="6" className="admin-input-group" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                className="admin-input"
              />
            </Form.Group>

            <Form.Group as={Col} md="6" className="admin-input-group" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                className="admin-input"
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} lg="7" md="6" className="admin-input-group" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-input"
              />
            </Form.Group>

            <Form.Group as={Col} lg="5" md="6" className="admin-input-group" controlId="formCompany">
              <Form.Label>Company</Form.Label>
              <Form.Control
                as="select"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="admin-input"
              >
                <option value="">Select a company</option>
                {companies.map((companyOption) => (
                  <option key={companyOption._id} value={companyOption._id}>
                    {companyOption.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleModalClose} disabled={loading} className="admin-button">
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleSave} disabled={loading} className="admin-button">
          {loading ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Save Changes'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditStudentModal;
