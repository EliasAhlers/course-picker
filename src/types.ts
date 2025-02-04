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

export enum Semester {
    WiSe2425 = "WiSe 24/25",
    SoSe25 = "SoSe 25",
    WiSe2526 = "WiSe 25/26",
    SoSe26 = "SoSe 26",
}

export enum CourseType {
    LECTURE = 'lecture',
    PRACTICAL = 'practical',
    SEMINARY = 'seminary',
    PROJECT = 'project',
    NONE = 'none',
    THESIS = 'thesis',
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

export enum CustomEventType {
    PI_LECTURE = "Praktische Informatik",
    FM_LECTURE = "Formale Methoden",
    GENERAL = "Allgemeine Kompetenzen"
}

export interface CustomEvent {
    name: string;
    cp: number;
    semester: string;
    type: CustomEventType;
}

export const getEmptyConflict = (): Conflict => {
    return { ids: [], reason: '' };
}
