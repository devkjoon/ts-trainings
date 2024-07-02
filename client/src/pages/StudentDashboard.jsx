import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import '../assets/css/Dashboard.css';

export default function StudentDashboard() {

  const navigate = useNavigate();

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
        </Row>
        <Row>
          <Button className='dashboardBtn' variant='outline-danger' size='lg' onClick={handleLogout}>Logout</Button>
        </Row>
      </div>
    </>
  );
}