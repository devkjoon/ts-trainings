import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API_URL from '../../config';
import AdminTokenVerification from '../../hooks/AdminTokenVerification';
import NewCompanyModal from '../../components/Modals/AddNewCompany';

import '../../assets/css/CompanyList.css';

export default function CompanyList() {
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
        const response = await fetch(`${API_URL}/company`, {
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
      const response = await fetch(`${API_URL}/company/new-company`, {
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

      if (result.success) {
        setCompanies((prevCompanies) => [...prevCompanies, result.company]);

        setAlert({ show: true, message: 'New company added successfully', variant: 'success' });

        // Close the modal and reset the form
        handleCloseModal();
        resetForm();
      } else {
        const errorMessage = result.message || 'Unsuccessful, please try again later';
        setAlert({ show: true, message: errorMessage, variant: 'danger' });
      }
    } catch (error) {
      console.error('Error adding new company:', error);
      setAlert({ show: true, message: 'Failed to add company. Please try again later.', variant: 'danger' });
    }
  };

  const handleDeleteCompany = async (companyId) => {
    const token = localStorage.getItem('token');

    const isConfirmed = window.confirm('Are you sure you want to delete this company? This action cannot be undone.');

    if (!isConfirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/company/${companyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || 'Failed to delete company');
        }

        setCompanies((prevCompanies) =>
            prevCompanies.filter((company) => company._id !== companyId)
        );
        setAlert({ show: true, message: 'Company deleted successfully', variant: 'success' });
    } catch (error) {
        console.error('Error deleting company:', error.message);
        setAlert({ show: true, message: error.message, variant: 'danger' });
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>{company.contact.name}</td>
              <td>{company.contact.email}</td>
              <td>{formatPhoneNumber(company.contact.phoneNumber)}</td>
              <td>
                <Button 
                  variant="outline-danger" 
                  onClick={() => handleDeleteCompany(company._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Link to='/admin/dashboard' className='no-underline'>
        <Button className="button-25 mt-3" variant="outline-info" size="lg">Back</Button>
      </Link>
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
