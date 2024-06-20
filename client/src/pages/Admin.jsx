import React from 'react';
import { Button, Row } from 'react-bootstrap';

import './AdminLogin';
import './AdminRegistration';

export default function Admin() {
  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <a href="/AdminRegistration">
            <Button className="mainButton mt-3" variant="outline-info" size="lg">Register</Button>
          </a>
          <a href="/AdminLogin">
            <Button className="mainButton mt-3" variant="outline-warning" size="lg">Login</Button>
          </a>
        </Row>
      </div>
    </>
  );
}
