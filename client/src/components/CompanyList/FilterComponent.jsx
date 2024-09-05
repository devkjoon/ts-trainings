import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FilterComponent = ({
  companies,
  nameFilter,
  setNameFilter,
  resetFilters,
  handleShowNewModal,
}) => {
  return (
    <>
      <Row className="mb-3">
        <Col sm={12}>
          <Form.Control
            type="text"
            placeholder="Filter by Company Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={6} md={3} className="mb-2">
          <Link to="/admin/dashboard" className="no-underline">
            <Button variant="outline-warning" className="w-100">
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Button>
          </Link>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-2">
          <Button variant="outline-secondary" className="w-100" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Col>
        <Col xs={12} md={6}>
          <Button variant="outline-info" className="w-100" onClick={handleShowNewModal}>
            Add New Company
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default FilterComponent;
