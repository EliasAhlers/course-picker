export interface Course {
    id: number;
    name: string;
    instructor: string;
    domain: 'FM' | 'PI';
    semester: string;
    cp: number;
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

export type Conflict = [number, number];