import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'

import '../assets/css/Home.css';

export default function Home() {
  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <Col className='text-center'>
            <Link to="/admin" className='no-underline'>
              <Button className="mainButton mt-2" variant="outline-info" size="lg">Administrator Portal</Button>
            </Link>
          </Col>
          <Col className='text-center'>
            <Link to="/student/login" className='no-underline'>
              <Button className="mainButton mt-2" variant="outline-warning" size="lg">Student Login</Button>
            </Link>
          </Col>
          <Col className='text-center'>
            <Link to="" className='no-underline'>
              <Button className="mainButton mt-2" variant="outline-info" size="lg">Verify Certification</Button>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
}
