import React from 'react';
import './Changelog.css';
import '../EditEventModal/EditEventModal.css';

interface ChangelogProps {
    isOpen: boolean;
    onClose: () => void;
}

const Changelog: React.FC<ChangelogProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content changelog-content">
                <h2>Changelog</h2>
                <div className="changelog-section">
                    <h3>08. April 2025</h3>
                    <ul>
                        <li>Rauminformation zu benutzerdefinierten Ereignissen hinzugefügt</li>
                    </ul>
                </div>
                <div className="changelog-section">
                    <h3>07. April 2025</h3>
                    <ul>
                        <li>Position des Sync-Buttons geändert</li>
                        <li>Zeitplanunterstützung für benutzerdefinierte Ereignisse hinzugefügt</li>
                        <li>Zeitplanerstellung verbessert</li>
                        <li>Zusätzliche Kursdaten hinzugefügt</li>
                        <li>Changelog hinzugefügt (lol)</li>
                    </ul>
                </div>
                <div className="changelog-section">
                    <h3>25. März 2025</h3>
                    <ul>
                        <li>Kursbearbeitungsfunktion hinzugefügt</li>
                        <li>Kursdatengenerierung verbessert</li>
                    </ul>
                </div>
                <div className="changelog-section">
                    <h3>23.-24. März 2025</h3>
                    <ul>
                        <li>Kursdaten aktualisiert und fixes</li>
                        <li>Cloud-Synchronisierung hinzugefügt</li>
                        <li>Semesterfilterung zur Kursliste hinzugefügt</li>
                        <li>Konflikterkennung verbessert</li>
                        <li>Verschiedene semesterbezogene Probleme behoben</li>
                        <li>Informationen für Kurse ohne Zeitplan hinzugefügt</li>
                    </ul>
                </div>
                <div className="changelog-section">
                    <h3>Februar 2025</h3>
                    <ul>
                        <li>MOTD-System (<b>M</b>essage <b>O</b>f <b>T</b>he <b>D</b>ay) hinzugefügt</li>
                        <li>Server-Synchronisierung implementiert</li>
                        <li>Funktion für benutzerdefinierte Ereignisse hinzugefügt</li>
                    </ul>
                </div>
                <div className="changelog-section">
                    <h3>31. Januar 2025</h3>
                    <ul>
                        <li>Unterstützung für Masterarbeiten hinzugefügt</li>
                        <li>System für benutzerdefinierte Ereignisse hinzugefügt</li>
                        <li>Verschiedene Verbesserungen und fixes</li>
                    </ul>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose}>Schließen</button>
                </div>
            </div>
        </div>
    );
};

export default Changelog;
