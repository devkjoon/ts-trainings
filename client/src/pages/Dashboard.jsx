import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import '../components/NewStudent';

export default function Admin() {
  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <Col>
            <Button className="mainButton mt-3" variant="outline-info" size="lg" href='/NewStudent'>New Student</Button>
          </Col>
          <Col>
            <Button className="mainButton mt-3" variant="outline-warning" size="lg" href=''>Login</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}