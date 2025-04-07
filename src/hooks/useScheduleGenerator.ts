import { useState, useEffect } from 'react';
import { Course, ScheduleItem, CustomEvent, CourseType } from '../types';
import { courses } from '../courses';

const useScheduleGenerator = (selectedCourseIds: number[], selectedSemester: string, customEvents?: CustomEvent[]) => {
	const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
	const [uniqueTimes, setUniqueTimes] = useState<number[]>([]);
	const [groupedScheduleItems, setGroupedScheduleItems] = useState<{ [key: string]: ScheduleItem[] }>({});
	const [allCourses, setAllCourses] = useState<Course[]>([]);

	useEffect(() => {
		const selectedCourses = courses.filter(course => selectedCourseIds.includes(course.id) && course.semester === selectedSemester);
		setAllCourses(selectedCourses);

		const newScheduleItems = generateSchedule(selectedCourses, customEvents || [], selectedSemester);
		setScheduleItems(newScheduleItems);

		const newUniqueTimes = Array.from(new Set(newScheduleItems.map(item => item.start))).sort((a, b) => a - b);
		setUniqueTimes(newUniqueTimes);

		const newGroupedScheduleItems = groupScheduleItemsByDay(newScheduleItems);
		setGroupedScheduleItems(newGroupedScheduleItems);
	}, [selectedCourseIds, selectedSemester, customEvents, courses]);

	const generateSchedule = (courses: Course[], customEvents: CustomEvent[], semester: string): ScheduleItem[] => {
		const schedule: ScheduleItem[] = [];
		const daysOrder = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];

		courses.filter(course => course.semester === semester).forEach(course => {
			const addToSchedule = (timeString: string | undefined, isLecture: boolean) => {
				if (!timeString) return;
				const parts = timeString.split(', ');
				parts.forEach(part => {
					const [day, time] = part.split(' ');
					const [start, end] = time.split('-').map(Number);
					schedule.push({ course, day, start, end, isLecture });
				});
			};

			addToSchedule(course.schedule, true);
			addToSchedule(course.tutorial, false);
		});

		customEvents.filter(event => event.semester === semester && event.schedule).forEach(event => {
			const parts = event.schedule!.split(', ');
			parts.forEach(part => {
				const [day, time] = part.split(' ');
				const [start, end] = time.split('-').map(Number);
				schedule.push({
					course: {
						id: -1,
						name: event.name,
						instructor: '',
						domain: '',
						semester: event.semester,
						cp: event.cp,
						type: CourseType.NONE,
					},
					day,
					start,
					end,
					isLecture: true
				});
			});
		});

		return schedule.sort((a, b) => {
			const dayDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
			return dayDiff !== 0 ? dayDiff : a.start - b.start;
		});
	};

	const groupScheduleItemsByDay = (items: ScheduleItem[]): { [key: string]: ScheduleItem[] } => {
		return items.reduce((acc, item) => {
			if (!acc[item.day]) {
				acc[item.day] = [];
			}
			acc[item.day].push(item);
			return acc;
		}, {} as { [key: string]: ScheduleItem[] });
	};

	return { scheduleItems, uniqueTimes, groupedScheduleItems, allCourses };
};

export default useScheduleGenerator;