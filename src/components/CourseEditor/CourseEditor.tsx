import React, { useState, useEffect } from 'react';
import { Course, CourseType, Semester } from '../../types';
import { courses, removedCourseIds } from '../../courses';
import './CourseEditor.css';
import { generateCoursesFile } from '../../utils/courseGenerator';
import SemesterLabel from '../SemesterLabel/SemesterLabel';

interface CourseEditorProps {
    isOpen: boolean;
    onClose: () => void;
}

const CourseEditor: React.FC<CourseEditorProps> = ({ isOpen, onClose }) => {
    const [editableCourses, setEditableCourses] = useState<Course[]>([]);
    const [editableRemovedIds, setEditableRemovedIds] = useState<number[]>([]);
    const [nextId, setNextId] = useState<number>(0);
    const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
    const [showGeneratedCode, setShowGeneratedCode] = useState<boolean>(false);
    const [generatedCode, setGeneratedCode] = useState<string>('');

    useEffect(() => {
        // deep clone
        setEditableCourses(JSON.parse(JSON.stringify(courses)));
        setEditableRemovedIds([...removedCourseIds]);

        // find the highest id to determine next id
        const maxId = Math.max(...courses.map(course => course.id), 0);
        setNextId(maxId + 1);
    }, [isOpen]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCourseChange = (index: number, field: keyof Course, value: any) => {
        const updatedCourses = [...editableCourses];
        if (field === 'type' || field === 'semester') {
            updatedCourses[index][field] = value;
        } else if (field === 'id' || field === 'cp') {
            updatedCourses[index][field] = parseInt(value) || 0;
        } else if (field === 'bachelor') {
            updatedCourses[index][field] = value === 'true';
        } else if (field === 'dependsOn') {
            updatedCourses[index][field] = value === '' ? undefined : parseInt(value);
        } else {
            updatedCourses[index][field] = value;
        }

        setEditableCourses(updatedCourses);
    };

    const addNewCourse = () => {
        const newCourse: Course = {
            id: nextId,
            type: CourseType.LECTURE,
            name: "New Course",
            instructor: "",
            domain: "PI",
            semester: Semester.SoSe25,
            cp: 6,
            schedule: "",
            room: ""
        };

        setEditableCourses([...editableCourses, newCourse]);
        setNextId(nextId + 1);
    };

    const removeCourse = (index: number) => {
        const courseToRemove = editableCourses[index];
        const updatedCourses = editableCourses.filter((_, i) => i !== index);

        if (courses.some(c => c.id === courseToRemove.id)) {
            setEditableRemovedIds([...editableRemovedIds, courseToRemove.id]);
        }

        setEditableCourses(updatedCourses);
    };

    const generateAndCopyCode = () => {
        const code = generateCoursesFile(editableCourses, editableRemovedIds);
        setGeneratedCode(code);
        setShowGeneratedCode(true);

        navigator.clipboard.writeText(code).then(() => {
            setCopiedToClipboard(true);
            setTimeout(() => setCopiedToClipboard(false), 3000);
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
        });
    };

    const getAvailableLectures = () => {
        return courses.filter(course => course.type === CourseType.LECTURE);
    };

    if (!isOpen) return null;

    return (
        <div className="course-editor-overlay">
            <div className="course-editor-modal">
                <h2>Course Editor</h2>
                <button className="close-button" onClick={onClose}>×</button>

                <div className="editor-controls">
                    <button onClick={addNewCourse}>Add New Course</button>
                    <button onClick={generateAndCopyCode}>Generate Code & Copy to Clipboard</button>
                    {copiedToClipboard && <span className="success-message">Copied to clipboard!</span>}
                </div>

                {showGeneratedCode && (
                    <div className="generated-code-container">
                        <h3>Generated Code</h3>
                        <button className="close-code-button" onClick={() => setShowGeneratedCode(false)}>Hide Code</button>
                        <pre className="generated-code">{generatedCode}</pre>
                    </div>
                )}

                <div className="removed-ids-section">
                    <h3>Removed Course IDs (read-only)</h3>
                    <div className="removed-ids-list">
                        {editableRemovedIds.map(id => (
                            <div key={id} className="removed-id-item">
                                ID: {id}
                            </div>
                        ))}
                        {editableRemovedIds.length === 0 && (
                            <span className="no-removed-ids">No removed course IDs</span>
                        )}
                    </div>
                </div>

                <div className="courses-table-container">
                    <table className="courses-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Instructor</th>
                                <th>Domain</th>
                                <th>Semester</th>
                                <th>CP</th>
                                <th>Schedule</th>
                                <th>Tutorial</th>
                                <th>Room</th>
                                <th>Bachelor</th>
                                <th>Depends On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editableCourses.map((course, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="number"
                                            value={course.id}
                                            onChange={(e) => handleCourseChange(index, 'id', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={course.name}
                                            onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            value={course.type}
                                            onChange={(e) => handleCourseChange(index, 'type', e.target.value)}
                                        >
                                            {Object.values(CourseType).map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={course.instructor}
                                            onChange={(e) => handleCourseChange(index, 'instructor', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            value={course.domain}
                                            onChange={(e) => handleCourseChange(index, 'domain', e.target.value)}
                                        >
                                            <option value="PI">PI</option>
                                            <option value="FM">FM</option>
                                            <option value="">None</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            value={course.semester}
                                            onChange={(e) => handleCourseChange(index, 'semester', e.target.value)}
                                        >
                                            {Object.values(Semester).map(semester => (
                                                <option key={semester} value={semester}>
                                                    <SemesterLabel semester={semester} />
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={course.cp}
                                            onChange={(e) => handleCourseChange(index, 'cp', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={course.schedule || ""}
                                            onChange={(e) => handleCourseChange(index, 'schedule', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={course.tutorial || ""}
                                            onChange={(e) => handleCourseChange(index, 'tutorial', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={course.room || ""}
                                            onChange={(e) => handleCourseChange(index, 'room', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            value={course.bachelor ? 'true' : 'false'}
                                            onChange={(e) => handleCourseChange(index, 'bachelor', e.target.value)}
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            value={course.dependsOn || ""}
                                            onChange={(e) => handleCourseChange(index, 'dependsOn', e.target.value)}
                                        >
                                            <option value="">None</option>
                                            {getAvailableLectures().map(lecture => (
                                                <option key={lecture.id} value={lecture.id}>
                                                    {lecture.name} ({lecture.id})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="remove-course-button"
                                            onClick={() => removeCourse(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourseEditor;
