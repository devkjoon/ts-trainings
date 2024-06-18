import React from 'react';
import Button from 'react-bootstrap/Button';

import '../App.css';
import '../assets/css/Home.css';

import './AdminLogin';

export default function Admin() {
  return (
    <>
      <div className='buttonContainer'>
          <a className='mainButton' href="">
          <Button variant="outline-warning" size="lg">Register</Button>{' '}
          </a>
          <a className='mainButton' href="/AdminLogin">
          <Button variant="outline-info" size="lg">Login</Button>{' '}
          </a>
      </div>
    </>
  );
}
