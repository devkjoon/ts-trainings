import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AssignCourse = ({ show, handleClose, studentId, companies, showAlert }) => {
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    const handleAssignCourse = async () => {
        try {
            const response = await fetch(`/api/assignCourse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    studentId,
                    companyId: selectedCompany,
                    courseId: selectedCourse,
                }),
            });

            const result = await response.json();
            if (result.success) {
                showAlert('Course assigned successfully', 'success');
                handleClose();
            } else {
                showAlert(result.message || 'Failed to assign course', 'danger');
            }
        } catch (error) {
            console.error('Error assigning course:', error);
            showAlert('Failed to assign course', 'danger');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Assign Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Select Company</Form.Label>
                        <Form.Select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                        >
                            <option value="">Choose a company</option>
                            {companies.map((company) => (
                                <option key={company._id} value={company._id}>
                                    {company.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {/* Additional form fields for course selection */}
                    <Button variant="primary" onClick={handleAssignCourse}>
                        Assign
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AssignCourse;
