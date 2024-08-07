// src/components/Company/Companies.jsx
import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Table, Alert } from 'react-bootstrap';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';
import NewCompanyModal from '../Tools/NewCompanyModal'; // Import the new modal component

import '../../assets/css/StudentList.css'

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
            Add New Company
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

      <NewCompanyModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleNewCompany}
        companyName={companyName}
        setCompanyName={setCompanyName}
        companyPhone={companyPhone}
        setCompanyPhone={setCompanyPhone}
        companyAddress={companyAddress}
        setCompanyAddress={setCompanyAddress}
        companyCity={companyCity}
        setCompanyCity={setCompanyCity}
        companyState={companyState}
        setCompanyState={setCompanyState}
        companyZip={companyZip}
        setCompanyZip={setCompanyZip}
        companyContactName={companyContactName}
        setCompanyContactName={setCompanyContactName}
        companyContactEmail={companyContactEmail}
        setCompanyContactEmail={setCompanyContactEmail}
        companyContactPhone={companyContactPhone}
        setCompanyContactPhone={setCompanyContactPhone}
      />
    </Container>
  );
}
