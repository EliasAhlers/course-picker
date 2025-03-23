import React from 'react';
import { Semester } from '../../types';

interface SemesterLabelProps {
    semester: Semester | string;
    className?: string;
}

const SemesterLabel: React.FC<SemesterLabelProps> = ({ semester, className = '' }) => {
    return (
        <span className={className}>
            {semester.replace(/(\d{2})(\d{2})/, ' $1/$2').replace(/SoSe(\d{2})\b/, 'SoSe $1')}
        </span>
    );
};

export default SemesterLabel;
