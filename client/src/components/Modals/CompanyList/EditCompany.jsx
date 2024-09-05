import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EditCompanyModal = ({ show, handleClose, company, handleUpdateCompany }) => {
  const [name, setName] = useState(company.name);
  const [phoneNumber, setPhoneNumber] = useState(company.phoneNumber);
  const [streetAddress, setStreetAddress] = useState(company.address.streetAddress);
  const [city, setCity] = useState(company.address.city);
  const [state, setState] = useState(company.address.state);
  const [zipcode, setZipcode] = useState(company.address.zipcode);
  const [contactName, setContactName] = useState(company.contact.name);
  const [contactEmail, setContactEmail] = useState(company.contact.email);
  const [contactPhone, setContactPhone] = useState(company.contact.phoneNumber);

  useEffect(() => {
    setName(company.name);
    setPhoneNumber(company.phoneNumber);
    setStreetAddress(company.address.streetAddress);
    setCity(company.address.city);
    setState(company.address.state);
    setZipcode(company.address.zipcode);
    setContactName(company.contact.name);
    setContactEmail(company.contact.email);
    setContactPhone(company.contact.phoneNumber);
  }, [company]);

  const handleSave = () => {
    const updatedCompany = {
      ...company,
      name,
      phoneNumber,
      address: {
        streetAddress,
        city,
        state,
        zipcode,
      },
      contact: {
        name: contactName,
        email: contactEmail,
        phoneNumber: contactPhone,
      },
    };
    handleUpdateCompany(updatedCompany);
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-dialog" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Company</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-content">
        <Form>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="formStreetAddress">
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <Form.Group className="mb-3" controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formZipcode">
                <Form.Label>Zipcode</Form.Label>
                <Form.Control
                  type="tel"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formContactName">
                <Form.Label>Contact Name</Form.Label>
                <Form.Control
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formContactPhone">
                <Form.Label>Contact Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="formContactEmail">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCompanyModal;
