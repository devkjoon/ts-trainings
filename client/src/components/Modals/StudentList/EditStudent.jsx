import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

const EditStudentModal = ({
    show,
    handleClose,
    student,
    handleUpdateStudent,
    showAlert,
    companies,
}) => {
    const [firstname, setFirstname] = useState(student.firstname);
    const [lastname, setLastname] = useState(student.lastname);
    const [email, setEmail] = useState(student.email);
    const [company, setCompany] = useState(student.company ? student.company._id : '');

    useEffect(() => {
        // Update state when student prop changes
        setFirstname(student.firstname);
        setLastname(student.lastname);
        setEmail(student.email);
        setCompany(student.company ? student.company._id : '');
    }, [student]);

    const handleSave = () => {
        const updatedStudent = {
            ...student,
            firstname,
            lastname,
            email,
            company,
        };
        handleUpdateStudent(updatedStudent);
    };

    const handleModalClose = () => {
        // Reset form fields to initial values
        setFirstname(student.firstname);
        setLastname(student.lastname);
        setEmail(student.email);
        setCompany(student.company ? student.company._id : '');
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleModalClose} dialogClassName="custom-modal-dialog" centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Student</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-content">
                <Form>
                  <Row>
                    <Form.Group as={Col} md="6" className="mb-2" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6" className="mb-2" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} lg="8"md="6" className="mb-2" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} lg="4" md="6" className="mb-2" controlId="formCompany">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                            as="select"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        >
                            <option value="">Select a company</option>
                            {companies.map((companyOption) => (
                                <option key={companyOption._id} value={companyOption._id}>
                                    {companyOption.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                  </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleModalClose}>
                    Close
                </Button>
                <Button variant="outline-primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditStudentModal;
