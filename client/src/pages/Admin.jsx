import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

export default function Admin() {
  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <Col>
            <Button className="mainButton mt-3" variant="outline-info" size="lg" href='/admin/registration'>Register</Button>
          </Col>
          <Col>
            <Button className="mainButton mt-3" variant="outline-warning" size="lg" href='/admin/login'>Login</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}
