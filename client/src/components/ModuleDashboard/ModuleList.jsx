import React from 'react';
import { Row } from 'react-bootstrap';
import ModuleCard from './ModuleCard';

//  a container that holds and displays a list of 'ModuleCard' components
//  manages the state of flipped cards and handles module selection

const ModuleList = ({ modules, flippedCards, handleModuleClick, handleButtonClick }) => (
  <Row className="justify-content-center align-items-stretch module-list-container">
    {modules.map((module) => {
      const isFlipped = flippedCards[module._id];

      return (
        <ModuleCard
          key={module._id}
          module={module}
          flipped={isFlipped}
          onFlip={() => handleModuleClick(module._id)}
          onButtonClick={() => handleButtonClick(module._id)}
        />
      );
    })}
  </Row>
);

export default ModuleList;
