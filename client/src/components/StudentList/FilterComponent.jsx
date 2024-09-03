import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FilterComponent = ({
    companies,
    courses,
    companyFilter,
    courseFilter,
    setCompanyFilter,
    setCourseFilter,
    resetFilters,
    handleShowNewStudentModal,
}) => {
    return (
        <>
            <Row className="mb-3">
                <Col sm={6}>
                    <Form.Select
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                    >
                        <option value="">Filter by Company</option>
                        {companies.map((company) => (
                            <option key={company._id} value={company._id}>
                                {company.name}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col sm={6}>
                    <Form.Select
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                    >
                        <option value="">Filter by Course</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.title}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col xs={12} sm={3} className="mb-2 mb-sm-0">
                    <Link to='/admin/dashboard' className='no-underline'>
                        <Button variant="outline-warning" className="w-100">
                            <i className="fas fa-arrow-left"></i> Back to Dashboard
                        </Button>
                    </Link>
                </Col>
                <Col xs={12} sm={3} className="mb-2 mb-sm-0">
                    <Button variant="outline-secondary" className="w-100" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                </Col>
                <Col xs={12} sm={6}>
                    <Button variant="outline-info" className="w-100" onClick={handleShowNewStudentModal}>
                        Add New Student
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default FilterComponent;
