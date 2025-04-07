import React from 'react';
import { CustomEvent, CustomEventType, Semester } from '../../types';
import './EditEventModal.css';
import SemesterLabel from '../SemesterLabel/SemesterLabel';

interface EditEventModalProps {
    event: CustomEvent | null;
    onSave: (event: CustomEvent) => void;
    onClose: () => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ event, onSave, onClose }) => {
    const [name, setName] = React.useState(event?.name || '');
    const [cp, setCp] = React.useState(event?.cp || 3);
    const [type, setType] = React.useState(event?.type || CustomEventType.GENERAL);
    const [semester, setSemester] = React.useState(event?.semester || Semester.WiSe2425);
    const [schedule, setSchedule] = React.useState(event?.schedule || '');

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{event ? 'Veranstaltung bearbeiten' : 'Veranstaltung hinzufügen'}</h2>
                
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Veranstaltungsname"
                />
                
                <label>CP:</label>
                <input
                    type="number"
                    value={cp}
                    onChange={(e) => setCp(parseInt(e.target.value))}
                    min="1"
                    max="30"
                />
                
                <label>Typ:</label>
                <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as CustomEventType)}
                >
                    {Object.values(CustomEventType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                
                <label>Semester:</label>
                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as Semester)}
                >
                    {Object.values(Semester).map(sem => (
                        <option key={sem} value={sem}>
                            <SemesterLabel semester={sem} />
                        </option>
                    ))}
                </select>
                
                <label>Schedule (optional):</label>
                <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="z.B. Mo 14-16, Do 12-14"
                />
                
                <div className="modal-actions">
                    <button onClick={onClose}>Abbrechen</button>
                    <button onClick={() => {
                        if (name && cp) {
                            onSave({
                                name,
                                cp,
                                type,
                                semester,
                                schedule: schedule || undefined
                            });
                        }
                    }}>Speichern</button>
                </div>
            </div>
        </div>
    );
};