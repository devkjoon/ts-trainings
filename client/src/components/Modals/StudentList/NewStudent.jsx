import React from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const NewStudent = ({
  show,
  handleClose,
  handleSubmit,
  firstname,
  setFirstname,
  lastname,
  setLastname,
  email,
  setEmail,
  company,
  setCompany,
  companies,
  isLoading,
}) => {
  const clearForm = () => {
    setFirstname('');
    setLastname('');
    setEmail('');
    setCompany('');
  };

  const handleModalClose = () => {
    clearForm();
    handleClose();
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await handleSubmit(event);
    clearForm();
  };

  return (
    <Modal show={show} onHide={handleModalClose} dialogClassName="custom-modal-dialog" centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Student</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-content">
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formCompany">
            <Form.Label>Company</Form.Label>
            <Form.Select value={company} onChange={(e) => setCompany(e.target.value)}>
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="outline-primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              'Add Student'
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewStudent;
