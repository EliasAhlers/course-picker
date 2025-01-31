import React, { useState } from 'react';
import { CourseType, Semester, CustomEvent } from '../../types';
import './SemesterTable.css';
import { courses } from '../../courses';

interface SemesterTableProps {
    selectedCourseIds: number[];
    customEvents: CustomEvent[];
    setCustomEvents: React.Dispatch<React.SetStateAction<CustomEvent[]>>;
}

const SemesterTable: React.FC<SemesterTableProps> = ({ selectedCourseIds, customEvents, setCustomEvents }) => {
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

    const [customEventSelectedSemester, setCustomEventSelectedSemester] = useState<string>(Semester.WiSe2425);
    const [customEventName, setCustomEventName] = useState<string>('');
    const [customEventCP, setCustomEventCP] = useState<number>(3);

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Semester</th>
                        <th>CP</th>
                        <th>Seminare</th>
                        <th>Veranstaltungen</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(Semester).map((key) => (
                            <tr key={key}>
                                <td>{Semester[key as keyof typeof Semester]}</td>
                                <td>{calculateCP(Semester[key as keyof typeof Semester])}</td>
                                <td>{renderBadges(Semester[key as keyof typeof Semester])}</td>
                                <td>
                                    {
                                        customEvents.filter(event => event.semester === Semester[key as keyof typeof Semester] || event.semester == key).map(event => (
                                            <p key={event.name}>{event.name} ({event.cp} CP) <button onClick={() => {
                                                setCustomEvents(prev => prev.filter(e => e !== event));
                                            }} >🗑️</button></p>
                                        ))
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <h2>Eigene Veranstaltung</h2>
            Hier können z.B. Zusatzkompetenzen oder andere Veranstaltungen eingetragen werden, die nicht in der Liste sind.
            Diese werden nicht auf Konflikte überprüft, aber in die CP pro Semester eingerechnet. <br></br>
            <div className="custom-event-form">
                <label>Semester:</label>
                <select
                    value={customEventSelectedSemester}
                    onChange={(e) => setCustomEventSelectedSemester(e.target.value)}
                >
                    {Object.keys(Semester).map((key) => (
                        <option key={key} value={key}>
                            {Semester[key as keyof typeof Semester]}
                        </option>
                    ))}
                </select>

                <label>Name:</label>
                <input
                    onChange={(e) => setCustomEventName(e.target.value)}
                    value={customEventName}
                    type="text"
                />

                <label>CP:</label>
                <input
                    onChange={(e) => setCustomEventCP(parseInt(e.target.value))}
                    value={customEventCP}
                    type="number"
                    min="0"
                    max="30"
                    step="1"
                />

                <button
                    onClick={() => {
                        const customEvent: CustomEvent = {
                            semester: customEventSelectedSemester as Semester,
                            name: customEventName,
                            cp: customEventCP,
                        };
                        if (customEvent.name === '' || customEvent.cp === 0) {
                            alert('Bitte fülle alle Felder aus.');
                        } else if (customEvents.some((event) => event.name === customEvent.name)) {
                            alert('Veranstaltung existiert bereits.');
                        } else {
                            setCustomEvents((prev) => [...prev, customEvent]);
                        }
                    }}
                >
                    Eintragen
                </button>
            </div>
        </>
    );
};

export default SemesterTable;