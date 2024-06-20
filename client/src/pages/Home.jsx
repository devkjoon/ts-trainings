import React from 'react';
import { Button, Row } from 'react-bootstrap';

import '../assets/css/Home.css';
import './Admin'

export default function Home() {
  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <a href="/admin">
            <Button className="mainButton mt-3" variant="outline-info" size="lg">I am an Administrator</Button>
          </a>
          <a href="">
            <Button className="mainButton mt-3" variant="outline-warning" size="lg">I am a Student</Button>
          </a>
        </Row>
      </div>
    </>
  );
}
