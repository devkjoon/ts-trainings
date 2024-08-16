import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Admin() {
  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <Col>
            <Link to='/admin/registration' className='no-underline'>
              <Button className="mainButton mt-2" variant="outline-info" size="lg">Register</Button>
            </Link>
          </Col>
          <Col>
            <Link to='/admin/login' className='no-underline'>
              <Button className="mainButton mt-2" variant="outline-warning" size="lg">Login</Button>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
}
