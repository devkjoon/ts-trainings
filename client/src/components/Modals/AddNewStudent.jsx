import React from 'react';
import { Modal, Button, Row, Col, InputGroup, Form, Spinner } from 'react-bootstrap';

import '../../assets/css/Modals.css'

const AddNewStudent = ({
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
  isLoading
}) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} noValidate>
          <Row>
            <Form.Group as={Col} md='6' className='mb-2 mt-2'>
              <Form.Label>First Name</Form.Label>
              <InputGroup className='registrationInput'>
                <Form.Control
                  type='text'
                  placeholder='First Name'
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a first name</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md='6' className='mb-2 mt-2'>
              <Form.Label>Last Name</Form.Label>
              <InputGroup className='registrationInput'>
                <Form.Control
                  type='text'
                  placeholder='Last Name'
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a last name</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md='6' className='mb-2 mt-2'>
              <Form.Label>Email</Form.Label>
              <InputGroup className='registrationInput'>
                <Form.Control
                  type='email'
                  placeholder='example@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter an email address</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md='6' className='mb-2 mt-2'>
              <Form.Label>Company</Form.Label>
              <InputGroup className='registrationInput'>
                <Form.Control
                  as='select'
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type='invalid'>Select a company</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Button type='submit' variant='outline-info' className='mt-2'>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Add Student'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewStudent;
