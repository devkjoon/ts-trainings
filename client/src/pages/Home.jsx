import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import '../assets/css/Home.css';

export default function Home() {
  return (
    <>
      <div className='buttonContainer'>
        <Col className='text-center'>
          <Button className="mainButton mt-3" variant="outline-info" size="lg" href="/admin">I am an Administrator</Button>
        </Col>
        <Col className='text-center'>
          <Button className="mainButton mt-3" variant="outline-warning" size="lg" href="/student/login">I am a Student</Button>
        </Col>
      </div>
    </>
  );
}
