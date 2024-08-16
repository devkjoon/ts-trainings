import React from 'react';
import { Button, Row, Col, } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';

import '../../assets/css/Dashboard.css';

export default function AdminDashboard() {

  AdminTokenVerification()

  return (
    <>
      <div className='dashboardContainer'>
        <Row>
          <Col className='text-center'>
            <Link to='/admin/students' className='no-underline'>
              <Button className="dashboardBtn" variant="outline-warning" size="lg">Students</Button>
            </Link>
          </Col>
            <Col className='text-center'>
            <Link to='/admin/courses' className='no-underline'>
              <Button className="dashboardBtn" variant="outline-info" size="lg">Course Directory</Button>
            </Link>
          </Col>
          <Col className='text-center'>
            <Link to="/admin/companies" className='no-underline'>
              <Button className="dashboardBtn" variant="outline-warning" size="lg">Companies</Button>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
}