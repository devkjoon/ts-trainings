import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';

import '../../assets/css/ModuleCard.css'

const ModuleCard = ({ module, flipped, onFlip, onButtonClick, buttonText, buttonVariant }) => (
  <Col sm={12} md={6} lg={4} className="mb-4 d-flex col-center">
    <Card className={`module-card h-100 w-100 ${flipped ? 'flipped' : ''}`}>
      <div className="card-inner">
        <div className="card-front d-flex" onClick={onFlip}>
          <Card.Img className="moduleCardImg" src={module.moduleIconUrl || 'default-image-url.jpg'} alt="Module Image" />
          <Card.Body className="card-body-flex">
            <Card.Title className="module-content m-auto">{module.title}</Card.Title>
          </Card.Body>
          </div>
          <div className="card-footer-container">
          <Card.Footer className="card-footer">
            <Button
              className="module-dashboard-btn"
              variant={buttonVariant}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card flip when clicking the button
                onButtonClick();
              }}
              disabled={module.isLocked}
            >
              {buttonText}
            </Button>
          </Card.Footer>
        </div>
        <div className="card-back" onClick={onFlip}>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <div className="description-header">
              <strong>About this Module:</strong>
            </div>
            <ul className="description-list scrollable-description text-left">
              {module.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </Card.Body>
        </div>
      </div>
    </Card>
  </Col>
);

export default ModuleCard;
