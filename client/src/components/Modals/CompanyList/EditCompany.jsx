import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';

import '../../../assets/css/AdminPreLogin.css'; // Import the pre-login CSS

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
  const [loading, setLoading] = useState(false);

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

  const handleSave = async () => {
    setLoading(true);
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
    await handleUpdateCompany(updatedCompany);
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="admin-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="admin-form">
          <Row>
            <Col md={8}>
              <Form.Group className="admin-input-group" controlId="formName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} className="admin-input" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="admin-input-group" controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="admin-input"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="admin-input-group" controlId="formStreetAddress">
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="admin-input"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <Form.Group className="admin-input-group" controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)} className="admin-input" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="admin-input-group" controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="admin-input"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="admin-input-group" controlId="formZipcode">
                <Form.Label>Zipcode</Form.Label>
                <Form.Control
                  type="tel"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="admin-input"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="admin-input-group" controlId="formContactName">
                <Form.Label>Contact Name</Form.Label>
                <Form.Control
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="admin-input"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="admin-input-group" controlId="formContactPhone">
                <Form.Label>Contact Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="admin-input"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="admin-input-group" controlId="formContactEmail">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="admin-input"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose} disabled={loading} className="admin-button">
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

export default EditCompanyModal;
