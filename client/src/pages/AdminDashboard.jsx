import React from 'react';
import { Button, Row, Col, } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import AdminTokenVerification from '../components/AdminTokenVerification';

import '../assets/css/Dashboard.css';

export default function AdminDashboard() {

  const navigate = useNavigate();

  AdminTokenVerification()

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <>
      <div className='dashboardContainer'>
        <Row>
            <Col className='text-center'>
            <Button className="dashboardBtn" variant="outline-info" size="lg" href='/admin/new-student'>New Student</Button>
          </Col>
          <Col className='text-center'>
            <Button className="dashboardBtn" variant="outline-warning" size="lg" href='/admin/students'>Student List</Button>
          </Col>        
            <Col className='text-center'>
            <Button className="dashboardBtn" variant="outline-info" size="lg" href='/admin/courses'>Course List</Button>
          </Col>
          <Col className='text-center'>
            <Button className="dashboardBtn" variant="outline-warning" size="lg" href='/admin/students'>Student List</Button>
          </Col>
        </Row>
        <Row>
          <Button variant='outline-danger' size='lg' onClick={handleLogout}>Logout</Button>
        </Row>
      </div>
    </>
  );
}