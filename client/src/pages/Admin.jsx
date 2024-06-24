import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import '../components/AdminLogin';
import '../components/AdminRegistration';

export default function Admin() {
  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <Col>
            <Button className="mainButton mt-3" variant="outline-info" size="lg" href='/AdminRegistration'>Register</Button>
          </Col>
          <Col>
            <Button className="mainButton mt-3" variant="outline-warning" size="lg" href='/AdminLogin'>Login</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}
