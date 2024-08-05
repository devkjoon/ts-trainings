import React from 'react';
import { Button, Row, Col, } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AdminTokenVerification from '../hooks/AdminTokenVerification';

import '../assets/css/Dashboard.css';

export default function AdminDashboard() {

  AdminTokenVerification()

  return (
    <>
      <div className='dashboardContainer'>
        <Row>
            <Col className='text-center'>
            <Link to='/admin/new-student' className='no-underline'>
              <Button className="dashboardBtn" variant="outline-info" size="lg">New Student</Button>
            </Link>
          </Col>
          <Col className='text-center'>
            <Link to='/admin/students' className='no-underline'>
              <Button className="dashboardBtn" variant="outline-warning" size="lg">Student List</Button>
            </Link>
          </Col>
            <Col className='text-center'>
            <Link to='/admin/courses' className='no-underline'>
              <Button className="dashboardBtn" variant="outline-info" size="lg">Course List</Button>
            </Link>
          </Col>
          <Col className='text-center'>
            <Link to='/admin/students' className='no-underline'>
              <Button className="dashboardBtn" variant="outline-warning" size="lg">Add a Module</Button>
            </Link>
          </Col>
          <Col className='text-center'>
            <Link to="/admin/contractors" className='no-underline'>
              <Button className="dashboardBtn" variant="outline-info" size="lg">Companies</Button>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
}