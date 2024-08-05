import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'

import '../assets/css/Home.css';

export default function Home() {
  return (
    <>
      <div className='buttonContainer'>
        <Col className='text-center'>
          <Link to="/admin">
            <Button className="mainButton mt-3" variant="outline-info" size="lg">I am an Administrator</Button>
          </Link>
        </Col>
        <Col className='text-center'>
          <Link to="/student/login">
            <Button className="mainButton mt-3" variant="outline-warning" size="lg">I am a Student</Button>
          </Link>
        </Col>
      </div>
    </>
  );
}
