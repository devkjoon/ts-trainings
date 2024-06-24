import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import '../assets/css/Dashboard.css';

import '../components/NewStudent';
import '../components/StudentList';

export default function Admin() {
  return (
    <>
      <div className='dashboardContainer'>
        <Row>
            <Col className='text-center'>
            <Button className="dashboardBtn" variant="outline-info" size="lg" href='/NewStudent'>New Student</Button>
          </Col>
          <Col className='text-center'>
            <Button className="dashboardBtn" variant="outline-warning" size="lg" href='/StudentList'>Student List</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}