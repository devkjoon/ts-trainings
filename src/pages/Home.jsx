import React from 'react';
import Button from 'react-bootstrap/Button';
import '../App.css'
import '../assets/css/Home.css';
import '../pages/GenerateCode'

export default function Home() {
  return (
    <>
    <div>
        <div>
            <h1>I am a</h1>
        </div>
        <div className='buttonContainer'>
            <a className='mainButton' href="/GenerateCode">
            <Button variant="outline-warning" size="lg">Administrator</Button>{' '}
            </a>
            <a className='mainButton' href="">
            <Button variant="outline-info" size="lg">Student</Button>{' '}
            </a>
        </div>
      </div>
    </>
  );
}
