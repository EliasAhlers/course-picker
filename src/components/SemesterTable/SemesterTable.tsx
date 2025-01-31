import React from 'react';
import { CourseType } from '../../types';
import './SemesterTable.css';
import { courses } from '../../courses';
import { Semester } from '../../utils/enums';

interface SemesterTableProps {
    selectedCourseIds: number[];
}

const SemesterTable: React.FC<SemesterTableProps> = ({ selectedCourseIds }) => {
    const selectedCourses = courses.filter(course => selectedCourseIds.includes(course.id));
    const calculateCP = (semester: string) =>
        selectedCourses.filter(course => course.semester === semester).reduce((sum, course) => sum + course.cp, 0);

    const hasSeminars = (semester: string) =>
        selectedCourses.some(course => course.semester === semester && course.type === CourseType.SEMINARY);

    const hasProseminars = (semester: string) =>
        selectedCourses.some(course => course.semester === semester && course.type === CourseType.PROJECT);

    const renderBadges = (semester: string) => {
        return (
            <>
                {hasSeminars(semester) && <span className="badge badge-seminar">Informatikseminar</span>}
                {hasProseminars(semester) && <span className="badge badge-proseminar">Projektseminar</span>}
            </>
        );
    };  

    return (
        <table>
            <thead>
                <tr>
                    <th>Semester</th>
                    <th>CP</th>
                    <th>Seminare</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>WiSe 24/25</td>
                    <td>{calculateCP(Semester.WiSe2425)}</td>
                    <td>{renderBadges(Semester.WiSe2425)}</td>
                </tr>
                <tr>
                    <td>SoSe 25</td>
                    <td>{calculateCP(Semester.SoSe25)}</td>
                    <td>{renderBadges(Semester.SoSe25)}</td>
                </tr>
                <tr>
                    <td>WiSe 25/26</td>
                    <td>{calculateCP("WiSe 25/26")}</td>
                    <td>{renderBadges("WiSe 25/26")}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default SemesterTable;