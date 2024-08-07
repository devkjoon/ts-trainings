import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, InputGroup, Table, Form, Alert, Modal } from 'react-bootstrap';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  const [companyName, setCompanyName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyCity, setCompanyCity] = useState('');
  const [companyState, setCompanyState] = useState('');
  const [companyZip, setCompanyZip] = useState('');
  const [companyContactName, setCompanyContactName] = useState('');
  const [companyContactEmail, setCompanyContactEmail] = useState('');
  const [companyContactPhone, setCompanyContactPhone] = useState('');

  AdminTokenVerification();

  // Utility function to format phone numbers
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      return phoneNumber; // Return as is if invalid
    }
    return `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5000/company', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const data = await response.json();
        setCompanies(data.companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const resetForm = () => {
    setCompanyName('');
    setCompanyPhone('');
    setCompanyAddress('');
    setCompanyCity('');
    setCompanyState('');
    setCompanyZip('');
    setCompanyContactName('');
    setCompanyContactEmail('');
    setCompanyContactPhone('');
  };

  const handleNewCompany = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/company/new-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: companyName,
          phoneNumber: companyPhone,
          address: {
            streetAddress: companyAddress,
            city: companyCity,
            state: companyState,
            zipcode: companyZip,
          },
          contact: {
            name: companyContactName,
            email: companyContactEmail,
            phoneNumber: companyContactPhone
          }
        })
      });

      const result = await response.json();
    console.log('Add company result:', result);

    if (result.success) {
        // Assume result.company is available here if the backend is supposed to return it
        if (result.company) {
          setCompanies((prevCompanies) => [...prevCompanies, result.company]);
        } else {
          // Manually create a new company object if the result doesn't include it
          const newCompany = {
            _id: new Date().getTime().toString(), // Or another way to generate a unique ID
            name: companyName,
            contact: {
              name: companyContactName,
              email: companyContactEmail,
              phoneNumber: companyContactPhone
            }
          };
          setCompanies((prevCompanies) => [...prevCompanies, newCompany]);
        }
  
        setAlert({ show: true, message: 'New company added successfully', variant: 'success' });
  
        // Close the modal and reset the form
        handleCloseModal();
        resetForm();
      } else {
        console.log('Result indicates failure:', result);
  
        // Use a generic error message if the result does not indicate success
        const errorMessage = result.message || 'Unsuccessful, please try again later';
        setAlert({ show: true, message: errorMessage, variant: 'danger' });
      }
    } catch (error) {
      console.error('Error adding new company:', error);
      setAlert({ show: true, message: 'Failed to add company. Hit up Joon and ask him why', variant: 'danger' });
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={10}>
          <h1 className='mt-4 mb-4'>Company List</h1>
        </Col>
        <Col className='m-auto p-auto'>
          <Button className='company-button mb-2' variant="outline-info" onClick={handleShowModal}>
            Add Company
          </Button>
        </Col>
      </Row>
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}
      <Table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Company Representative</th>
            <th>Contact Email</th>
            <th>Contact Number</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>{company.contact.name}</td>
              <td>{company.contact.email}</td>
              <td>{formatPhoneNumber(company.contact.phoneNumber)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Add New Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleNewCompany}>
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
    </Container>
  )
}
