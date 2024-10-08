import React from 'react';
import { Course, Conflict, CourseType } from '../../types';
import './CourseList.css';

interface CourseListProps {
  courses: Course[];
  selectedCourses: Course[];
  showBachelorCourses: boolean;
  onCourseToggle: (course: Course) => void;
  conflicts: Conflict[];
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  selectedCourses,
  showBachelorCourses,
  onCourseToggle,
  conflicts
}) => {
  const isDuplicateSelected = (course: Course) => {
    return selectedCourses.some(c => c.name === course.name && c.id !== course.id);
  };

  const isConflict = (courseId: number) => {
    return conflicts.some(conflict => conflict.ids.includes(courseId));
  };

  const isPraktikumDisabled = (course: Course) => {
    if (course.type != CourseType.PRACTICAL) return false;
    return !selectedCourses.some(c => c.id === course.dependsOn);
  };

  const getSemesterClass = (semester: string): string => {
    const cleanSemester = semester.replace(/\s/g, '-').replace('/', '-');
    return `semester-${cleanSemester}`;
  };

  return (
    <div className="table-container">
      <table className="responsive-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Dozent:in</th>
            <th>Bereich</th>
            <th>Semester</th>
            <th>CP</th>
            <th>Raum</th>
            <th>Zeit</th>
            <th>Übung</th>
          </tr>
        </thead>
        <tbody>
          {courses
            .filter(course => showBachelorCourses || !course.bachelor)
            .map(course => (
              <tr key={course.id} className={`
                ${course.domain} 
                ${isDuplicateSelected(course) ? 'duplicate' : ''}
                ${isConflict(course.id) ? 'conflict' : ''}
                ${course.type == CourseType.PRACTICAL ? 'praktikum' : ''}
                ${course.type == CourseType.SEMINARY ? 'seminary' : ''}
                ${course.type == CourseType.PROJECT ? 'project' : ''}
              `}>
                <td data-label="Auswahl">
                  <input
                    type="checkbox"
                    checked={selectedCourses.some(c => c.id === course.id)}
                    onChange={() => onCourseToggle(course)}
                    disabled={isDuplicateSelected(course) || isPraktikumDisabled(course)}
                  />
                </td>
                <td data-label="Name">
                  <div className="course-name">
                    {course.name}
                    {course.bachelor && <span className="bachelor-badge">Bachelor</span>}
                    {course.type == CourseType.PRACTICAL && <span className="praktikum-badge">Praktikum</span>}
                    {course.type == CourseType.SEMINARY && <span className="seminary-badge">Informatikseminar</span>}
                    {course.type == CourseType.PROJECT && <span className="project-badge">Projektseminar</span>}
                  </div>
                </td>
                <td data-label="Dozent" className="instructor">{course.instructor}</td>
                <td data-label="Bereich"><span className="domain-badge">{course.domain}</span></td>
                <td data-label="Semester">
                  <span className={`semester-badge ${getSemesterClass(course.semester)}`}>
                    {course.semester}
                  </span>
                </td>
                <td data-label="CP">{course.cp}</td>
                <td data-label="Raum">{course.room || ''}</td>
                <td data-label="Zeit">
                  <div className='course-time'>{course.schedule || '?'}</div>
                </td>
                <td data-label="Übung">
                  <div className='course-time'>{course.type != CourseType.PRACTICAL ? (course.tutorial || '?') : ''}</div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;