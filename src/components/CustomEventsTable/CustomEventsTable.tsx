import React, { useState } from 'react';
import { CustomEvent, CustomEventType } from '../../types';
import { EditEventModal } from '../EditEventModal/EditEventModal';
import './CustomEventsTable.css';

interface CustomEventsTableProps {
    customEvents: CustomEvent[];
    setCustomEvents: React.Dispatch<React.SetStateAction<CustomEvent[]>>;
}

const CustomEventsTable: React.FC<CustomEventsTableProps> = ({ customEvents, setCustomEvents }) => {
    const [editingEvent, setEditingEvent] = useState<CustomEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleSaveEvent = (updatedEvent: CustomEvent) => {
        setCustomEvents(prev => prev.map(e =>
            e === editingEvent ? updatedEvent : e
        ));
        setEditingEvent(null);
    };

    return (
        <>
            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onSave={handleSaveEvent}
                    onClose={() => setEditingEvent(null)}
                />
            )}
            <div className="custom-events-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sem</th>
                            <th>Veranstaltung</th>
                            <th>Opt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customEvents.map(event => (
                            <tr key={event.name}>
                                <td>{event.semester}</td>
                                <td>
                                    {event.name} ({event.cp} CP) <span style={{minWidth: '1rem'}} > </span>
                                    <span className={`event-type-badge ${event.type?.toLowerCase().replace(' ', '-') || 'general'}`}>
                                        {event.type === CustomEventType.PI_LECTURE ? 'PI' : 
                                        event.type === CustomEventType.FM_LECTURE ? 'FM' : 'AK'}
                                    </span>
                                </td>
                                <td>
                                    <div className="event-actions">
                                        <button className="icon-button" onClick={() => setEditingEvent(event)}>✎</button>
                                        <button className="icon-button" onClick={() => setCustomEvents(prev => prev.filter(e => e !== event))}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="add-event-button">
                <button className="button-primary" onClick={() => setIsModalOpen(true)}>
                    Eigene Veranstaltung hinzufügen
                </button>
            </div>

            {isModalOpen && (
                <EditEventModal
                    event={null}
                    onSave={(newEvent) => {
                        setCustomEvents(prev => [...prev, newEvent]);
                        setIsModalOpen(false);
                    }}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default CustomEventsTable;