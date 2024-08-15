import React from 'react';
import { Row } from 'react-bootstrap';
import ModuleCard from './ModuleCard';

const ModuleList = ({ modules, flippedCards, handleModuleClick, handleButtonClick }) => (
  <Row className="justify-content-center align-items-stretch">
    {modules.map((module) => {
      const isFlipped = flippedCards[module._id];
      const buttonText = module.isFinalTest
        ? module.isLocked
          ? "Locked"
          : "Take Test"
        : module.completed
          ? "Review"
          : "Learn";

      const buttonVariant = module.isFinalTest
        ? module.isLocked
          ? 'outline-danger'
          : 'outline-primary'
        : module.completed
          ? 'outline-warning'
          : 'outline-primary';

      return (
        <ModuleCard
          key={module._id}
          module={module}
          flipped={isFlipped}
          onFlip={() => handleModuleClick(module._id)}
          onButtonClick={() => handleButtonClick(module._id)}
          buttonText={buttonText}
          buttonVariant={buttonVariant}
        />
      );
    })}
  </Row>
);

export default ModuleList;
