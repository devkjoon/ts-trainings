import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Table, Alert, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API_URL from '../../config';
import AdminTokenVerification from '../../hooks/AdminTokenVerification';
import NewCompanyModal from '../../components/Modals/AddNewCompany';

import '../../assets/css/CompanyList.css';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [open, setOpen] = useState({});

  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  AdminTokenVerification();

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      return phoneNumber;
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
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setCompanyDetails({
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    });
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
          name: companyDetails.name,
          phoneNumber: companyDetails.phone,
          address: {
            streetAddress: companyDetails.address,
            city: companyDetails.city,
            state: companyDetails.state,
            zipcode: companyDetails.zip,
          },
          contact: {
            name: companyDetails.contactName,
            email: companyDetails.contactEmail,
            phoneNumber: companyDetails.contactPhone
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        setCompanies((prevCompanies) => [...prevCompanies, result.company]);
        handleCloseModal();
        showAlert('New company added successfully', 'success', true);
      } else {
        showAlert(result.message || 'Unsuccessful, please try again later', 'danger');
      }
    } catch (error) {
      console.error('Error adding new company:', error);
      showAlert('Failed to add company. Please try again later.', 'danger');
    }
  };


  const handleDeleteCompany = async (companyId) => {
    const token = localStorage.getItem('token');
    const isConfirmed = window.confirm('Are you sure you want to delete this company? This action cannot be undone.');

    if (!isConfirmed) return;

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

      setCompanies((prevCompanies) => prevCompanies.filter((company) => company._id !== companyId));
      showAlert('Company deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting company:', error.message);
      showAlert(error.message, 'danger');
    }
  };

const toggleCollapse = (id) => {
  setOpen((prevOpen) => ({
    ...prevOpen,
    [id]: !prevOpen[id],
  }));
};


return (
  <Container>
    <Row>
      <Col sm={12}>
         <h1 className="mt-4 mb-3">Company List</h1>
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
    <Table striped bordered hover className="custom-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Representative</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company) => (
          <React.Fragment key={company._id}>
            <tr onClick={() => toggleCollapse(company._id)}>
              <td className='company-name-display'>{company.name}</td>
              <td>
                <span className="label-prefix">Representative: </span>
                <span className="data-text">{company.contact.name}</span>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ padding: 0 }}>
                <Collapse in={open[company._id]}>
                  <div className="p-2">
                    <Table bordered>
                      <tbody>
                        <tr>
                          <td><strong>Company Name:</strong></td>
                          <td>{company.name}</td>
                        </tr>
                        <tr>
                          <td><strong>Phone Number:</strong></td>
                          <td>{formatPhoneNumber(company.phoneNumber)}</td>
                        </tr>
                        <tr>
                          <td><strong>Street Address:</strong></td>
                          <td>{`${company.address.streetAddress}`}</td>
                        </tr>
                        <tr>
                          <td><strong>City, State, Zip:</strong></td>
                          <td>{`${company.address.city}, ${company.address.state} ${company.address.zipcode}`}</td>
                        </tr>
                        <tr>
                          <td><strong>Contact Name:</strong></td>
                          <td>{company.contact.name}</td>
                        </tr>
                        <tr>
                          <td><strong>Contact Email:</strong></td>
                          <td>{company.contact.email}</td>
                        </tr>
                        <tr>
                          <td><strong>Contact Phone:</strong></td>
                          <td>{formatPhoneNumber(company.contact.phoneNumber)}</td>
                        </tr>
                        <tr>
                          <td><strong>Actions:</strong></td>
                          <td>
                            <Button 
                              variant="outline-danger" 
                              onClick={() => handleDeleteCompany(company._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Collapse>
              </td>
            </tr>
          </React.Fragment>
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
      companyName={companyDetails.name}
      setCompanyName={(name) => setCompanyDetails((prev) => ({ ...prev, name }))}
      companyPhone={companyDetails.phone}
      setCompanyPhone={(phone) => setCompanyDetails((prev) => ({ ...prev, phone }))}
      companyAddress={companyDetails.address}
      setCompanyAddress={(address) => setCompanyDetails((prev) => ({ ...prev, address }))}
      companyCity={companyDetails.city}
      setCompanyCity={(city) => setCompanyDetails((prev) => ({ ...prev, city }))}
      companyState={companyDetails.state}
      setCompanyState={(state) => setCompanyDetails((prev) => ({ ...prev, state }))}
      companyZip={companyDetails.zip}
      setCompanyZip={(zip) => setCompanyDetails((prev) => ({ ...prev, zip }))}
      companyContactName={companyDetails.contactName}
      setCompanyContactName={(contactName) => setCompanyDetails((prev) => ({ ...prev, contactName }))}
      companyContactEmail={companyDetails.contactEmail}
      setCompanyContactEmail={(contactEmail) => setCompanyDetails((prev) => ({ ...prev, contactEmail }))}
      companyContactPhone={companyDetails.contactPhone}
      setCompanyContactPhone={(contactPhone) => setCompanyDetails((prev) => ({ ...prev, contactPhone }))}
    />
  </Container>
);
}