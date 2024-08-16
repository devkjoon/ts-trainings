import React from 'react';
import '../../assets/css/ProgressBar.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="progress-text">{progress}% Complete</span>
    </div>
  );
};

export default ProgressBar;
