// src/components/AddCompanyModal.jsx
import React from 'react';
import { Modal, Button, Row, Col, InputGroup, Form } from 'react-bootstrap';

const AddNewCompany = ({
  show,
  handleClose,
  handleSubmit,
  companyName,
  setCompanyName,
  companyPhone,
  setCompanyPhone,
  companyAddress,
  setCompanyAddress,
  companyCity,
  setCompanyCity,
  companyState,
  setCompanyState,
  companyZip,
  setCompanyZip,
  companyContactName,
  setCompanyContactName,
  companyContactEmail,
  setCompanyContactEmail,
  companyContactPhone,
  setCompanyContactPhone,
}) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <h2 className='mt-2'>Company Info</h2>
          <Row>
            <Form.Group as={Col} md='8' className='mb-2 mt-2'>
              <Form.Label>Company Name</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='Think Safety LLCS'
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md='4' className='mb-2 mt-2'>
              <Form.Label>Company Phone Number</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='(###) ###-####'
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a valid phone number</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md='5' className='mb-2 mt-2'>
              <Form.Label>Street Address</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='5701 W Braddock Rd'
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a street address</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md='3' className='mb-2 mt-2'>
              <Form.Label>City</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='Alexandria'
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a city</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md='2' className='mb-2 mt-2'>
              <Form.Label>State</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='VA'
                  value={companyState}
                  onChange={(e) => setCompanyState(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a state</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md='2' className='mb-2 mt-2'>
              <Form.Label>Zip Code</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='#####'
                  value={companyZip}
                  onChange={(e) => setCompanyZip(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a zip code</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <h2 className='mt-2'>Company Contact</h2>
          <Row>
            <Form.Group as={Col} md='4' className='mb-2 mt-2'>
              <Form.Label>Contact Name</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='John Doe'
                  value={companyContactName}
                  onChange={(e) => setCompanyContactName(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a contact name</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md='4' className='mb-2 mt-2'>
              <Form.Label>Email</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='email'
                  placeholder='email@mail.com'
                  value={companyContactEmail}
                  onChange={(e) => setCompanyContactEmail(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a valid email</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md='4' className='mb-2 mt-2'>
              <Form.Label>Phone</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='(###) ###-####'
                  value={companyContactPhone}
                  onChange={(e) => setCompanyContactPhone(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a valid phone number</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Button type='submit' variant='outline-info' className='mt-2'>Add Company</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewCompany;
