export interface Course {
    id: number;
    name: string;
    instructor: string;
    domain: 'FM' | 'PI' | '';
    semester: string;
    cp: number;
    schedule?: string;
    tutorial?: string;
    bachelor?: boolean;
    // isPraktikum?: boolean;
    type: CourseType;
    dependsOn?: number; // ID of the base lecture for Praktikum
    room?: string;
}

export enum CourseType {
    LECTURE = 'lecture',
    PRACTICAL = 'practical',
    SEMINARY = 'seminary',
    PROJECT = 'project',
    NONE = 'none'
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

export interface Conflict {
    ids: number[];
    reason: string;
}

export const getEmptyConflict = (): Conflict => {
    return { ids: [], reason: '' };
}