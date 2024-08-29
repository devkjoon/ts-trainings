import React from 'react';
import { Row } from 'react-bootstrap';
import ModuleCard from './ModuleCard';

const ModuleList = ({ modules, flippedCards, handleModuleClick, handleButtonClick }) => (
  <Row className="justify-content-center align-items-stretch">
    {modules.map((module) => {
      const isFlipped = flippedCards[module._id];
      const buttonText = module.completed
        ? "Review"
        : module.isFinalTest
          ? module.isLocked
            ? "Locked"
            : "Take Test"
          : "Learn";

      const buttonVariant = module.completed
        ? 'outline-warning'
        : module.isFinalTest
          ? module.isLocked
            ? 'outline-danger'
            : 'outline-primary'
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
