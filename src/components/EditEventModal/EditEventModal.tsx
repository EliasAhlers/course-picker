import React from 'react';
import { CustomEvent, CustomEventType, Semester } from '../../types';
import './EditEventModal.css';

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

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{event ? 'Veranstaltung bearbeiten' : 'Veranstaltung hinzufügen'}</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Veranstaltungsname"
                />
                <input
                    type="number"
                    value={cp}
                    onChange={(e) => setCp(parseInt(e.target.value))}
                    min="1"
                    max="30"
                />
                <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as CustomEventType)}
                >
                    {Object.values(CustomEventType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as Semester)}
                >
                    {Object.values(Semester).map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                    ))}
                </select>
                <div className="modal-actions">
                    <button onClick={onClose}>Abbrechen</button>
                    <button onClick={() => {
                        if (name && cp) {
                            onSave({
                                name,
                                cp,
                                type,
                                semester
                            });
                        }
                    }}>Speichern</button>
                </div>
            </div>
        </div>
    );
};