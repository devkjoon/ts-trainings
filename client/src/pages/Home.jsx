import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import VerifyCertification from '../components/Modals/VerifyCertification';
import '../assets/css/Home.css';

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Container className="home-container">
      <div className="home-content">
        <h6 className="home-subtitle">SAFETY IS OUR #1 PRIORITY</h6>
        <h1 className="home-title">
          Welcome to <span className="home-title-think">Think</span> <span className="home-title-safety">Safety</span>
        </h1>
        <div className="home-button-container">
          <Link to="/admin/login" className="home-button-link">
            <Button className="home-button" variant="outline-primary" size="lg">
              Administrator Login
            </Button>
          </Link>
          <Link to="/student/login" className="home-button-link">
            <Button className="home-button" variant="outline-warning" size="lg">
              Student Login
            </Button>
          </Link>
          <div className="home-button-link">
            <Button
              className="home-button"
              variant="outline-info"
              size="lg"
              onClick={handleShowModal}
            >
              Verify Certification
            </Button>
          </div>
        </div>
      </div>
      <VerifyCertification show={showModal} handleClose={handleCloseModal} />
    </Container>
  );
}
