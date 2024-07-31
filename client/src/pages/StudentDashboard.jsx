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
            <Button className="dashboardBtn" variant="outline-info" size="lg" href='/student/courses'>My Courses</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}