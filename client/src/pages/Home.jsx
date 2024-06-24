import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import '../assets/css/Home.css';
import './Admin'
import '../components/StudentLogin'

export default function Home() {
  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <Col className='text-center'>
            <Button className="mainButton mt-3" variant="outline-info" size="lg" href="/Admin">I am an Administrator</Button>
          </Col>
          <Col className='text-center'>
            <Button className="mainButton mt-3" variant="outline-warning" size="lg" href="StudentLogin">I am a Student</Button>
          </Col>
        </Row>
      </div>
    </>
  );
}
