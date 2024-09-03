import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API_URL from '../../config';
import AdminTokenVerification from '../../hooks/AdminTokenVerification';
import CompanyTable from '../../components/CompanyList/CompanyTable';
import FilterComponent from '../../components/CompanyList/FilterComponent';
import NewCompanyModal from '../../components/Modals/CompanyList/NewCompany';
import EditCompanyModal from '../../components/Modals/CompanyList/EditCompany';

import '../../assets/css/CompanyList.css';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  AdminTokenVerification();

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

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
      showAlert('Failed to fetch companies', 'danger');
    }
  };

  const handleShowNewModal = () => setShowNewModal(true);
  const handleCloseNewModal = () => setShowNewModal(false);

  const handleShowEditModal = (company) => {
    setCompanyToEdit(company);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCompanyToEdit(null);
  };

  const handleNewCompany = async (newCompany) => {
    try {
      const response = await fetch(`${API_URL}/company/new-company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCompany)
      });

      const result = await response.json();

      if (result.success) {
        await fetchCompanies();
        handleCloseNewModal();
        showAlert('New company added successfully', 'success', true);
      } else {
        showAlert(result.message || 'Unsuccessful, please try again later', 'danger');
      }
    } catch (error) {
      console.error('Error adding new company:', error);
      showAlert('Failed to add company. Please try again later.', 'danger');
    }
  };

  const handleUpdateCompany = async (updatedCompany) => {
    try {
      const response = await fetch(`${API_URL}/company/${updatedCompany._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedCompany)
      });

      const result = await response.json();

      if (result.success) {
        await fetchCompanies();
        handleCloseEditModal();
        showAlert('Company updated successfully', 'success');
      } else {
        showAlert(result.message || 'Failed to update company. Please try again later.', 'danger');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      showAlert('Failed to update company. Please try again later.', 'danger');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this company? This action cannot be undone.');

    if (!isConfirmed) return;

    try {
      const response = await fetch(`${API_URL}/company/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete company');
      }

      await fetchCompanies();
      showAlert('Company deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting company:', error.message);
      showAlert(error.message, 'danger');
    }
  };

  const resetFilters = () => {
    setNameFilter('');
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  return (
    <Container fluid className="company-list-container">
      <Row className="mb-3 mt-3">
        <Col>
          <h1 className="text-center">Company List</h1>
        </Col>
      </Row>
      <FilterComponent
        companies={companies}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        resetFilters={resetFilters}
        handleShowNewModal={handleShowNewModal}
      />
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}
      <div className="table-responsive company-table-container">
        <CompanyTable
          companies={filteredCompanies}
          handleShowEditModal={handleShowEditModal}
          handleDeleteCompany={handleDeleteCompany}
        />
      </div>
      {/* Modals */}
      <NewCompanyModal
        show={showNewModal}
        handleClose={handleCloseNewModal}
        handleSubmit={handleNewCompany}
      />
      {companyToEdit && (
        <EditCompanyModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          company={companyToEdit}
          handleUpdateCompany={handleUpdateCompany}
        />
      )}
    </Container>
  );
}