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
            <Form.Group as={Col} lg='8' md='6' className='mb-2 mt-2'>
              <Form.Label>Company Name</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='Think Safety LLC'
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <Form.Control.Feedback type='invalid'>Enter a company name</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} lg='4' md='6' className='mb-2 mt-2'>
            <Form.Label>Company Phone Number</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='tel'
                  placeholder='(###) ###-####'
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                  pattern="\d{10}"
                />
                <Form.Control.Feedback type='invalid'>Enter a valid 10-digit phone number</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className="company-input-group">
            <Form.Group as={Col} lg='5' className='mb-2 mt-2'>
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
            <Form.Group as={Col} lg='3' md='6' className='mb-2 mt-2'>
              <Form.Label>City</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='Alexandria'
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  required
                  pattern="[a-zA-Z\s]+"
                />
                <Form.Control.Feedback type='invalid'>Enter a valid city name</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} lg='2' md='2' className='mb-2 mt-2'>
              <Form.Label>State</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='VA'
                  value={companyState}
                  onChange={(e) => setCompanyState(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 2))}
                  required
                  pattern="[a-zA-Z]{2}"
                />
                <Form.Control.Feedback type='invalid'>Enter a valid 2-letter state abbreviation</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} lg='2' md='4' className='mb-2 mt-2'>
              <Form.Label>Zip Code</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='tel'
                  placeholder='#####'
                  value={companyZip}
                  onChange={(e) => setCompanyZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  required
                  pattern="\d{5}"
                />
                <Form.Control.Feedback type='invalid'>Enter a valid 5-digit zip code</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <h2 className='mt-2'>Company Contact</h2>
          <Row>
            <Form.Group as={Col} lg='4' className='mb-2 mt-2'>
              <Form.Label>Contact Name</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='text'
                  placeholder='John Doe'
                  value={companyContactName}
                  onChange={(e) => setCompanyContactName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  required
                  pattern="[a-zA-Z\s]+"
                />
                <Form.Control.Feedback type='invalid'>Enter a valid contact name</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} lg='4' className='mb-2 mt-2'>
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
            <Form.Group as={Col} lg='4' className='mb-2 mt-2'>
              <Form.Label>Phone</Form.Label>
              <InputGroup className='company-input'>
                <Form.Control
                  type='tel'
                  placeholder='(###) ###-####'
                  value={companyContactPhone}
                  onChange={(e) => setCompanyContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                  pattern="\d{10}"
                />
                <Form.Control.Feedback type='invalid'>
                  Enter a valid 10-digit phone number
                </Form.Control.Feedback>
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
