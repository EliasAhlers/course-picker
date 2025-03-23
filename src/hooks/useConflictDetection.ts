import { useState, useEffect } from 'react';
import { Course, Conflict, TimeSlot } from '../types';
import { courses } from '../courses';

const hasLectureConflict = (times1: TimeSlot[], times2: TimeSlot[]): boolean => {
  for (const time1 of times1) {
    for (const time2 of times2) {
      if (timeOverlap(time1, time2)) return true;
    }
  }
  return false;
};

const timeOverlap = (time1: TimeSlot, time2: TimeSlot): boolean => {
  return time1.day === time2.day &&
    ((time1.start <= time2.start && time2.start < time1.end) ||
      (time2.start <= time1.start && time1.start < time2.end));
};

const getTimes = (course: Course) => {
  const times: { lecture: TimeSlot[], tutorial: TimeSlot[] } = { lecture: [], tutorial: [] };
  const addTimes = (zeitString: string | undefined, isLecture: boolean) => {
    if (!zeitString) return;
    const parts = zeitString.split(', ');
    for (const part of parts) {
      const [day, time] = part.split(' ');
      const [start, end] = time.split('-').map(Number);
      if (isLecture) {
        times.lecture.push({ day, start, end });
      } else {
        times.tutorial.push({ day, start, end });
      }
    }
  };
  addTimes(course.schedule, true);
  addTimes(course.tutorial, false);
  return times;
};

const detectConflicts = (courses: Course[], semester: string): Conflict[] => {
  const conflicts: Conflict[] = [];
  for (let i = 0; i < courses.length; i++) {
    const localConflicts = getConflicts(courses[i], courses, semester);
    if (localConflicts.ids.length > 0) {
      conflicts.push({
        ...localConflicts,
        ids: localConflicts.ids.sort((a, b) => a - b)
      });
    }
  }
  return conflicts;
};

const getConflicts = (course: Course, allCourses: Course[], semester: string): Conflict => {
  if (!course.schedule || course.semester !== semester) return { ids: [], reason: '' };

  // check lecture times
  for (const otherCourse of allCourses) {
    if (otherCourse.id === course.id) continue;
    if (hasLectureConflict(getTimes(course).lecture, getTimes(otherCourse).lecture)) {
      return { 
        ids: [course.id, otherCourse.id].sort((a, b) => a - b), 
        reason: `Vorlesungen überschneiden sich (${semester.startsWith('SoSe') ? semester : 'SoSe' + semester})`
      };
    }
  }

  // check tutorial times
  const times = getTimes(course);
  const tutorialConflicts: Conflict = { ids: [], reason: '' };
  for (const tutorialTimeSlot of times.tutorial) {
    for (const otherCourse of allCourses) {
      if (otherCourse.id === course.id) continue;
      if (hasLectureConflict([tutorialTimeSlot], getTimes(otherCourse).lecture)) {
        if (tutorialConflicts.ids.length === 0) {
          tutorialConflicts.ids.push(course.id);
          tutorialConflicts.ids.push(otherCourse.id);
        } else {
          tutorialConflicts.ids.push(otherCourse.id);
        }
      }
    }
  }

  if (tutorialConflicts.ids.length === times.tutorial.length + 1) {
    tutorialConflicts.ids.sort((a, b) => a - b);
    tutorialConflicts.reason = `Übungen überschneiden sich mit Vorlesungen (${semester.startsWith('SoSe') ? semester : 'SoSe' + semester})`;
    return tutorialConflicts;
  }

  return { ids: [], reason: '' };
};

const useConflictDetection = (selectedCourseIds: number[]) => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  useEffect(() => {
    const selectedCourses = courses.filter(course => selectedCourseIds.includes(course.id));
    const involvedSemesters = [...new Set(selectedCourses.map(course => course.semester))];
    
    const allConflicts = involvedSemesters.flatMap(semester => detectConflicts(selectedCourses.filter(course => course.semester === semester), semester));

    // remove duplicates based on sorted IDs
    const uniqueConflicts = allConflicts.filter((conflict, index) => {
      const conflictKey = conflict.ids.join(',');
      return index === allConflicts.findIndex(c => c.ids.join(',') === conflictKey);
    });

    setConflicts(uniqueConflicts);
  }, [selectedCourseIds]);

  return conflicts;
};

export default useConflictDetection;