import React from 'react';
import Button from 'react-bootstrap/Button';
import '../App.css'
import '../assets/css/Home.css';
import './Login'

export default function Home() {
  return (
    <>
      <div className='text-div'>
          <h1 className='main-text'>I am</h1>
      </div>
      <div className='buttonContainer'>
          <a className='mainButton' href="/Login">
          <Button variant="outline-warning" size="lg">An Administrator</Button>{' '}
          </a>
          <a className='mainButton' href="">
          <Button variant="outline-info" size="lg">A Student</Button>{' '}
          </a>
      </div>
    </>
  );
}
