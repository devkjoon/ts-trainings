import React from 'react';
import '../../assets/css/ProgressBar.css';

//  displays the student's progres through the course, represented as a percentage
//  the 'progress' prop is used to dynamically set the width of the
//    progress bar and the text indicating the percentage completed

const ProgressBar = ({ progress }) => {
  return (
    <div
      className="progress-bar-container"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      <span className="progress-text">{progress}% Complete</span>
    </div>
  );
};

export default ProgressBar;
