import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';

import '../../assets/css/ModuleCard.css';

//  displays individual modules as cards with the ability to flip and view the description
//  card also includes a button for the student to start or review the module

const ModuleCard = ({ module, flipped, onFlip, onButtonClick }) => {

  const getButtonText = () => {
    if (module.completed) return "Review";
    if (module.isFinalTest) return module.isLocked ? "Locked" : "Take Test";
    return "Learn";
  };

  const getButtonVariant = () => {
    if (module.completed) return 'outline-warning';
    if (module.isFinalTest) return module.isLocked ? 'outline-danger' : 'outline-primary';
    return 'outline-primary';
  };

  return (
    <Col lg={4} md={6} sm={12} className="mb-4">
      <div className={`module-card ${flipped ? 'flipped' : ''}`} onClick={onFlip}>
        <div className="card-inner">
          <div className="card-front">
            <div className="img-title-container">
              <div className="img-container">
                <img
                  className="module-card-img"
                  src={module.moduleIconUrl || 'default-image-url.jpg'}
                  alt="Module Icon"
                />
              </div>
              <div className="card-body-flex">
                <h3 className="module-title">{module.title}</h3>
              </div>
            </div>
            <div className="card-footer">
              <Button
                className="module-dashboard-btn"
                variant={getButtonVariant()}
                onClick={(e) => {
                  e.stopPropagation();
                  onButtonClick();
                }}
                disabled={module.isLocked}
              >
                {getButtonText()}
              </Button>
            </div>
          </div>
          <div className="card-back">
            <div className="card-back-body">
              <h4 className="description-header">About this Module:</h4>
              <ul className="scrollable-description">
                {module.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ModuleCard;