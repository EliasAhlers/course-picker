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
                    <h3>07. April 2025</h3>
                    <ul>
                        <li>Changed sync button positioning</li>
                        <li>Added schedule support for custom events</li>
                        <li>Improved schedule rendering</li>
                        <li>Added additional course data</li>
                        <li>Added change log (lol)</li>
                    </ul>
                </div>
                <div className="changelog-section">
                    <h3>25. März 2025</h3>
                    <ul>
                        <li>Added course editor functionality</li>
                        <li>Improved course data generation</li>
                    </ul>
                </div>
                <div className="changelog-section">
                    <h3>23.-24. März 2025</h3>
                    <ul>
                        <li>Updated course data and added important fixes</li>
                        <li>Added cloud sync functionality</li>
                        <li>Added semester filtering to course list</li>
                        <li>Improved conflict detection</li>
                        <li>Fixed various semester-related issues</li>
                        <li>Added info for courses without schedules</li>
                    </ul>
                </div>
                <div className="changelog-section">
                    <h3>Februar 2025</h3>
                    <ul>
                        <li>Added MOTD (Message of the Day) system</li>
                        <li>Implemented server sync functionality</li>
                        <li>Added custom events feature</li>
                    </ul>
                </div>
                <div className="changelog-section">
                    <h3>31. Januar 2025</h3>
                    <ul>
                        <li>Added master thesis support</li>
                        <li>Added custom events system</li>
                        <li>Various improvements and fixes</li>
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
