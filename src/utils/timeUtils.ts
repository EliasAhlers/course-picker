import { TimeSlot } from '../types';

export const timeOverlap = (time1: TimeSlot, time2: TimeSlot): boolean => {
  return time1.day === time2.day &&
    ((time1.start <= time2.start && time2.start < time1.end) ||
      (time2.start <= time1.start && time1.start < time2.end));
};

export const parseTimes = (timeString: string | undefined): TimeSlot[] => {
  if (!timeString) return [];
  const times: TimeSlot[] = [];
  const parts = timeString.split(', ');
  for (const part of parts) {
    const [day, time] = part.split(' ');
    const [start, end] = time.split('-').map(Number);
    times.push({ day, start, end });
  }
  return times;
};