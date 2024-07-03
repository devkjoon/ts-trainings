import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, InputGroup, Table, Form } from 'react-bootstrap';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';

 export default function Contractors() {

    const [contractors, setContractors] = useState([]);
    const [showForm, setShowForm] = useState(false);

    AdminTokenVerification();

    useEffect(() => {
        const fetchContractors = async () => {
            try {
                const response = await fetch('http://localhost:5000/contractor', {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                const data = await response.json();
                setContractors(data.contractors);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchContractors();
    }, []);

    const addContractorForm = () => {
        setShowForm((prevShowForm) => !prevShowForm);
    };

    return (
        <Container>
            <Row>
                <Col xs={10}>
                    <h1 className='mt-4 mb-4'>Contractor List</h1>
                </Col>
                <Col className='m-auto p-auto'>
                    <Row>
                        <Button className='contractor-button mb-2' variant="outline-info" onClick={addContractorForm}>{showForm ? 'Cancel Adding' : 'Add Contractor'}</Button>
                    </Row>
                    <Row>
                        <Button variant="outline-info">Manage Contractor</Button>
                    </Row>
                </Col>
            </Row>
            <Table>
                <thead>
                    <tr>
                        <th>Contractor</th>
                        <th>Contractor Representative</th>
                        <th>Contact Email</th>
                        <th>Contact Number</th>
                    </tr>
                </thead>
                <tbody>
                    {contractors.map((contractor) => (
                        <tr>
                            <td>{contractor.name}</td>
                            <td>{contractor.contact.name}</td>
                            <td>{contractor.contact.email}</td>
                            <td>{contractor.contact.number}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {showForm && (
                <Form>
                    <Row>
                        <Form.Group as={Col} md='6' className='mb-2 mt-2'>
                            <Form.Label>Contractor Name</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control type='text' placeholder='enter contractor name' />
                                <Form.Control.Feedback type='invalid'>
                                    Enter a name dummy
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md='6' className='mb-2 mt-2'>
                            <Form.Label>Contractor Name</Form.Label>
                            <InputGroup>
                                <Form.Control type='text' placeholder='enter contractor name' />
                                <Form.Control.Feedback type='invalid'>
                                    Enter a name dummy
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} md='6'>
                            <Form.Label>Contractor Name</Form.Label>
                            <InputGroup>
                                <Form.Control type='text' placeholder='enter contractor name' />
                                <Form.Control.Feedback type='invalid'>
                                    Enter a name dummy
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                </Form>
                
                
            )}
        </Container>
    )
 }