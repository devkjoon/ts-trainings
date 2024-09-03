import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';

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
                <Col xs={6}>
                    <Button variant="outline-warning student-list-button" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                </Col>
                <Col xs={6}>
                    <Button variant="outline-info student-list-button" onClick={handleShowNewStudentModal}>
                        Add New Student
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default FilterComponent;
