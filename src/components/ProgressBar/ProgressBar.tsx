import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, current, max }) => (
  <div className="progress-bar-container">
    <p>{label}: {current}/{max}</p>
    <div className="progress-bar">
      <div 
        className="progress" 
        style={{ width: `${Math.min(current / max * 100, 100)}%` }}
      >
        <span>{Math.round(current / max * 100)}%</span>
      </div>
    </div>
  </div>
);

export default ProgressBar;