import React from 'react';
import { Conflict, Course, CourseType } from '../../types';
import SemesterLabel from '../SemesterLabel/SemesterLabel';
import './CourseList.css';

interface CourseListProps {
	courses: Course[];
	selectedCourseIds: number[];
	semesterFilter: string;
	showBachelorCourses: boolean;
	onCourseToggle: (course: Course) => void;
	conflicts: Conflict[];
}

const CourseList: React.FC<CourseListProps> = ({
	courses,
	selectedCourseIds,
	semesterFilter,
	showBachelorCourses,
	onCourseToggle,
	conflicts
}) => {

	const disabledCourses: Course[] = [];

	const isDisabled = (course: Course): boolean => {
		const selectedFullCourses = courses.filter(c => selectedCourseIds.includes(c.id));
		if (selectedFullCourses.some(c => c.name === course.name && c.id !== course.id)) {
			disabledCourses.push(course);
			return true;
		}
		if(course.dependsOn && disabledCourses.some(c => c.id === course.dependsOn)) {
			return true;
		}
		return false;
	};

	const isConflict = (courseId: number) => {
		return conflicts.some(conflict => conflict.ids.includes(courseId));
	};

	const isPraktikumDisabled = (course: Course) => {
		if (course.type != CourseType.PRACTICAL) return false;
		// return !selectedCourses.some(c => c.id === course.dependsOn);
		return !course.dependsOn || !selectedCourseIds.includes(course.dependsOn);
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
						.filter(course => (showBachelorCourses || !course.bachelor) && (semesterFilter === 'all' || course.semester === semesterFilter))
						.map(course => (
							<tr key={course.id} className={`
                ${course.domain} 
                ${isDisabled(course) ? 'disabled' : ''}
                ${isConflict(course.id) ? 'conflict' : ''}
                ${course.type == CourseType.PRACTICAL ? 'praktikum' : ''}
                ${course.type == CourseType.SEMINARY ? 'seminary' : ''}
                ${course.type == CourseType.PROJECT ? 'project' : ''}
              `}>
								<td data-label="Auswahl">
									<input
										type="checkbox"
										// checked={selectedCourses.some(c => c.id === course.id)}
										checked={selectedCourseIds.includes(course.id)}
										onChange={() => onCourseToggle(course)}
										disabled={isDisabled(course) || isPraktikumDisabled(course)}
									/>
								</td>
								<td data-label="Name">
									<div className="course-name">
										{course.name}
										{course.bachelor && <span className="bachelor-badge">Bachelor</span>}
										{course.type == CourseType.PRACTICAL && <span className="praktikum-badge">Praktikum</span>}
										{course.type == CourseType.SEMINARY && <span className="seminary-badge">Informatikseminar</span>}
										{course.type == CourseType.PROJECT && <span className="project-badge">Projektseminar</span>}
										{course.type == CourseType.THESIS && <span className="thesis-badge">Abschlussarbeit</span>}
									</div>
								</td>
								<td data-label="Dozent" className="instructor">{course.instructor}</td>
								<td data-label="Bereich"><span className="domain-badge">{course.domain}</span></td>
								<td data-label="Semester">
									<span className={`semester-badge ${'semester-' + course.semester}`}>
									<SemesterLabel semester={course.semester} />
									</span>
								</td>
								<td data-label="CP">{course.cp}</td>
								<td data-label="Raum">{course.type != CourseType.PROJECT && course.type != CourseType.SEMINARY && course.type != CourseType.THESIS ? (course.room || '?') : '/'}</td>
								<td data-label="Zeit">
									<div className='course-time'>{course.type != CourseType.PROJECT && course.type != CourseType.SEMINARY && course.type != CourseType.THESIS ? (course.schedule || '?') : '/'}</div>
								</td>
								<td data-label="Übung">
									<div className='course-time'>{course.type != CourseType.PROJECT && course.type != CourseType.SEMINARY && course.type != CourseType.THESIS ? (course.tutorial || '?') : '/'}</div>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default CourseList;