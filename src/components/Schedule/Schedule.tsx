import React from 'react';
import { Course } from '../../types';
import useScheduleGenerator from '../../hooks/useScheduleGenerator';
import './Schedule.css';

interface ScheduleProps {
  selectedCourses: Course[];
  selectedSemester: string;
  isMobile: boolean;
}

const Schedule: React.FC<ScheduleProps> = ({ selectedCourses, selectedSemester, isMobile }) => {
  const { scheduleItems, uniqueTimes, groupedScheduleItems } = useScheduleGenerator(selectedCourses, selectedSemester);

  if (selectedSemester !== "WiSe 24/25") {
    return (
      <div className="disclaimer">
        <b>Hinweis:</b> Für das Semester {selectedSemester} sind noch keine Zeiten vorhanden, daher kann kein Stundenplan angezeigt werden.
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="mobile-schedule">
        {Object.keys(groupedScheduleItems).length === 0 ? (
          <p>Keine Kurse ausgewählt.</p>
        ) : (
          Object.entries(groupedScheduleItems).map(([day, items]) => (
            <div key={day} className="mobile-schedule-day-group">
              <h3>{day}</h3>
              {items.map((item, index) => (
                <div key={index} className={`mobile-schedule-item ${item.isLecture ? 'lecture' : 'tutorial'}`}>
                  <div className="mobile-schedule-time">{`${item.start}:00 - ${item.end}:00`}</div>
                  <div className="mobile-schedule-course">
                    <div className="course-name">{item.course.name}</div>
                    <div className="course-type">
                      <span className={`type-badge ${item.isLecture ? 'lecture-badge' : 'tutorial-badge'}`}>
                        {item.isLecture ? 'V' : 'Ü'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <table className="schedule">
      <thead>
        <tr>
          <th>Zeit</th>
          <th>Montag</th>
          <th>Dienstag</th>
          <th>Mittwoch</th>
          <th>Donnerstag</th>
          <th>Freitag</th>
        </tr>
      </thead>
      <tbody>
        {uniqueTimes.length === 0 ? (
          <tr>
            <td colSpan={6}>Keine Kurse ausgewählt.</td>
          </tr>
        ) : (
          uniqueTimes.map((time) => (
            <tr key={time}>
              <td>{`${time}:00 - ${time + 2}:00`}</td>
              {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map(day => {
                const item = scheduleItems.find(i => i.day === day && i.start === time);
                return (
                  <td key={day} className={item ? (item.isLecture ? 'lecture' : 'tutorial') : ''}>
                    {item && (
                      <>
                        <div className="course-name">{item.course.name}</div>
                        <div className="course-type">
                          <span className={`type-badge ${item.isLecture ? 'lecture-badge' : 'tutorial-badge'}`}>
                            {item.isLecture ? 'V' : 'Ü'}
                          </span>
                        </div>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Schedule;