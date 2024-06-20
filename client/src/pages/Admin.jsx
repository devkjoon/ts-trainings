import React from 'react';
import { Button, Row } from 'react-bootstrap';

import '../assets/css/Home.css';

import './AdminLogin';

export default function Admin() {
  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <a href="/admin">
            <Button className="mainButton mt-3" variant="outline-info" size="lg">Register</Button>
          </a>
          <a href="">
            <Button className="mainButton mt-3" variant="outline-warning" size="lg">Login</Button>
          </a>
        </Row>
      </div>
    </>
  );
}
