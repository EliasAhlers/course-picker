import React from 'react';
import { courses } from '../../courses';
import { CourseType, CustomEvent, Semester } from '../../types';
import './SemesterTable.css';
import SemesterLabel from '../SemesterLabel/SemesterLabel';

interface SemesterTableProps {
    selectedCourseIds: number[];
    customEvents: CustomEvent[];
}

const SemesterTable: React.FC<SemesterTableProps> = ({ selectedCourseIds, customEvents }) => {
    const selectedCourses = courses.filter(course => selectedCourseIds.includes(course.id));
    const calculateCP = (semester: string) =>
        selectedCourses.filter(course => course.semester === semester).reduce((sum, course) => sum + course.cp, 0) +
        customEvents.filter(event => event.semester.toLocaleLowerCase().replace(' ', '').replace('/', '') === semester.toLocaleLowerCase().replace(' ', '').replace('/', '')).reduce((sum, event) => sum + event.cp, 0);

    const hasSeminars = (semester: string) =>
        selectedCourses.some(course => course.semester === semester && course.type === CourseType.SEMINARY);

    const hasProseminars = (semester: string) =>
        selectedCourses.some(course => course.semester === semester && course.type === CourseType.PROJECT);

    const hasThesis = (semester: string) =>
        selectedCourses.some(course => course.semester === semester && course.type === CourseType.THESIS);

    const renderBadges = (semester: string) => {
        return (
            <>
                {hasSeminars(semester) && <span className="badge badge-seminar">Informatikseminar</span>}
                {hasProseminars(semester) && <span className="badge badge-proseminar">Projektseminar</span>}
                {hasThesis(semester) && <span className="badge badge-thesis">Masterarbeit</span>}
            </>
        );
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Semester</th>
                        <th>CP</th>
                        <th>Seminare & Arbeiten</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(Semester).map((key) => (
                            <tr key={key}>
                                <td><SemesterLabel semester={key} /></td>
                                <td>{calculateCP(Semester[key as keyof typeof Semester])}</td>
                                <td>{renderBadges(Semester[key as keyof typeof Semester])}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    );
};

export default SemesterTable;