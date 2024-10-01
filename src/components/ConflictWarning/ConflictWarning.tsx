import React from 'react';
import { Conflict, Course } from '../../types';
import './ConflictWarning.css';

interface ConflictWarningProps {
  conflicts: Conflict[];
  courses: Course[];
}

const ConflictWarning: React.FC<ConflictWarningProps> = ({ conflicts, courses }) => {
  if (conflicts.length === 0) return null;

  return (
    <div className="warning">
      <b>Achtung:</b> Es gibt Zeitüberschneidungen zwischen ausgewählten Kursen!
      <ul>
        {conflicts.map(conflict => (
          <li key={conflict.ids.join('-')}>
            {conflict.ids.map((id, index) => (
              <span key={id}>
                {courses.find(c => c.id === id)?.name}
                {index < conflict.ids.length - 1 && (index === conflict.ids.length - 2 ? ' und ' : ', ')}
              </span>
            ))}
            {" (" + conflict.reason + ")"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConflictWarning;