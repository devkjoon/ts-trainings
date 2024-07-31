import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, InputGroup, Table, Form, Alert } from 'react-bootstrap';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';

 export default function Contractors() {

    const [contractors, setContractors] = useState([]);
    const [showForm, setShowForm] = useState(false);
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

    useEffect(() => {
        const fetchContractors = async () => {
            try {
                const response = await fetch('http://localhost:5000/contractor', {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${localStorage.getItem( 'token' )}`
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

    const handleNewContractor = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropogation();
            setValidated(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/contractor/new-contractor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${localStorage.getItem( 'token' )}`
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
            console.log(result);
            if (result.success) {
                setAlert({ show: true, message: 'New contractor added', variant: 'success '})
                addContractorForm();
            } else {
                setAlert({ show: true, message: 'Unsuccessful, please try again later', variant: 'danger' });
            }
        } catch (error) {
            console.error('Error adding new contractor:', error);
            setAlert({ show: true, message: 'Failed to add contractor. Hit up Joon and ask him why', variant: 'danger' });
        }
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
                    </Row>o
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
                        <tr key={contractor._id}>
                            <td>{contractor.name}</td>
                            <td>{contractor.contact.name}</td>
                            <td>{contractor.contact.email}</td>
                            <td>{contractor.contact.phoneNumber}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {showForm && (
                <Form onSubmit={handleNewContractor}>
                    <h2 className='mt-2'>Company Info</h2>
                    <Row>
                        <Form.Group as={Col} md='8' className='mb-2 mt-2'>
                            <Form.Label>Company Name</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Think Safety LLCS'
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md='4' className='mb-2 mt-2'>
                            <Form.Label>Company Phone Number</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control 
                                    type='number' 
                                    placeholder='(###) ###-####'
                                    value={companyPhone}
                                    onChange={(e) => setCompanyPhone(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        
                    </Row>
                    <Row>
                        <Form.Group as={Col} md='4' className='mb-2 mt-2'>
                            <Form.Label>Street Address</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control 
                                    type='text' 
                                    placeholder='5701 W Braddock Rd'
                                    value={companyAddress}
                                    onChange={(e) => setCompanyAddress(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md='4' className='mb-2 mt-2'>
                            <Form.Label>City</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Alexandria'
                                    value={companyCity}
                                    onChange={(e) => setCompanyCity(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md='2' className='mb-2 mt-2'>
                            <Form.Label>State</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control 
                                    type='text' 
                                    placeholder='VA'
                                    value={companyState}
                                    onChange={(e) => setCompanyState(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md='2' className='mb-2 mt-2'>
                            <Form.Label>Zip Code</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control 
                                    type='number' 
                                    placeholder='#####'
                                    value={companyZip}
                                    onChange={(e) => setCompanyZip(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <h2 className='mt-2'>Company Contact</h2>
                    <Row>
                    <Form.Group as={Col} md='4' className='mb-2 mt-2'>
                            <Form.Label>Contact Name</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control 
                                    type='text' 
                                    placeholder='John Doe'
                                    value={companyContactName}
                                    onChange={(e) => setCompanyContactName(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md='4' className='mb-2 mt-2'>
                            <Form.Label>Email</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control 
                                    type='email' 
                                    placeholder='email@mail.com'
                                    value={companyContactEmail}
                                    onChange={(e) => setCompanyContactEmail(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md='4' className='mb-2 mt-2'>
                            <Form.Label>Phone</Form.Label>
                            <InputGroup className='contractor-input'>
                                <Form.Control 
                                    type='text' 
                                    placeholder='(###) ###-####'
                                    value={companyContactPhone}
                                    onChange={(e) => setCompanyContactPhone(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Enter a name dummy</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    {alert.show && (
                        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                            {alert.message}
                        </Alert>
                    )}
                    <Row>
                        <Col>
                            <Button type='submit' variant='outline-info' size='lg' className='mt-2'>Add Contractor</Button>
                        </Col>
                    </Row>
                </Form>
            )}
        </Container>
    )
 }