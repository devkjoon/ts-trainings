import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import VerifyCertification from '../components/Modals/VerifyCertification';
import '../assets/css/Home.css';

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className='buttonContainer'>
        <Row>
          <Col className='text-center'>
            <Link to="/admin" className='no-underline'>
              <Button className="mainButton mt-2" variant="outline-info" size="lg">
                Administrator Portal
              </Button>
            </Link>
          </Col>
          <Col className='text-center'>
            <Link to="/student/login" className='no-underline'>
              <Button className="mainButton mt-2" variant="outline-warning" size="lg">
                Student Login
              </Button>
            </Link>
          </Col>
          <Col className='text-center'>
              <Button className="mainButton mt-2" variant="outline-info" size="lg" onClick={handleShowModal}>
                Verify Certification
              </Button>
          </Col>
        </Row>
      </div>

      <VerifyCertification show={showModal} handleClose={handleCloseModal} />
    </>
  );
}
