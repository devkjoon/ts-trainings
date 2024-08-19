import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import '../../assets/css/ModuleCard.css';

const ModuleCard = ({ module, flipped, onFlip, onButtonClick, buttonText, buttonVariant }) => (
  <Col xs={12} md={6} lg={4} className="mb-4 d-flex">
    <Card className={`module-card ${flipped ? 'flipped' : ''}`}>
      <div className="card-inner">
        <div className="card-front" onClick={onFlip}>
          <div className="img-title-container">
            <div className="img-container">
              <Card.Img
                className="module-card-img"
                src={module.moduleIconUrl || 'default-image-url.jpg'}
                alt="Module Image"
              />
            </div>
            <Card.Body className="card-body-flex">
              <Card.Title className="module-content">{module.title}</Card.Title>
            </Card.Body>
          </div>
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
          <Card.Body className="card-back-body">
            <div className="description-header">
              <strong>About this Module:</strong>
            </div>
            <ul className="scrollable-description">
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
