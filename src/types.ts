export interface Course {
    id: number;
    name: string;
    instructor: string;
    domain: 'FM' | 'PI';
    semester: string;
    cp: number;
    cpWithPraktikum?: number;
    schedule?: string;
    tutorial?: string;
    bachelor?: boolean;
}

export interface ScheduleItem {
    course: Course;
    day: string;
    start: number;
    end: number;
    isLecture: boolean;
}

export interface TimeSlot {
    day: string;
    start: number;
    end: number;
}

// export type Conflict = number[]; // Array of course IDs

export interface Conflict {
    ids: number[];
    reason: string;
}

export const getEmptyConflict = (): Conflict => {
    return { ids: [], reason: '' };
}