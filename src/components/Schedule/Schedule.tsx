import React, { useEffect, useState } from 'react';
import useScheduleGenerator from '../../hooks/useScheduleGenerator';
import './Schedule.css';
import { CourseType, Semester, CustomEvent } from '../../types';

interface ScheduleProps {
	selectedCourseIds: number[];
	selectedSemester: string;
	isMobile: boolean;
	customEvents: CustomEvent[];
}

const Schedule: React.FC<ScheduleProps> = ({ selectedCourseIds, selectedSemester, isMobile, customEvents }) => {
	const { scheduleItems, groupedScheduleItems, allCourses } = useScheduleGenerator(selectedCourseIds, selectedSemester, customEvents);

	const [currentTimePosition, setCurrentTimePosition] = useState(0);

	const coursesWithoutSchedule = allCourses.filter(course => {
		return !scheduleItems.some(item => item.course.id === course.id);
	}).filter(course => course.type == CourseType.LECTURE);

	useEffect(() => {
		const updateCurrentTimePosition = () => {
			const now = new Date();
			const currentHour = now.getHours() + (now.getMinutes() / 60);
			if (currentHour >= 8 && currentHour <= 18) {
				const position = ((currentHour - 8) / 10) * 100;
				setCurrentTimePosition(Math.round(position));
			} else {
				setCurrentTimePosition(-1);
			}
		};

		updateCurrentTimePosition();
		const interval = setInterval(updateCurrentTimePosition, 60 * 1000);

		return () => clearInterval(interval);
	}, []);

	if (selectedSemester !== Semester.WiSe2425 && selectedSemester !== Semester.SoSe25) {
		return (
			<div className="disclaimer">
				<b>Hinweis:</b> Für das Semester {selectedSemester} sind noch keine Zeiten vorhanden, daher kann kein Stundenplan angezeigt werden.
			</div>
		);
	}

	const nextEventIndicator = () => {
		const now = new Date();
		const currentHour = now.getHours() + (now.getMinutes() / 60);
		const currentDay = now.toLocaleDateString('de-DE', { weekday: 'short' });

		const nextEvent = scheduleItems.filter((item) => item.course.semester == selectedSemester).find(item => item.day === currentDay && item.start > currentHour - 2);

		const roomOptions: boolean = nextEvent?.course.room ? nextEvent.course.room.includes('/') : false;


		return (
			<div>
				{nextEvent && (
					<div className="next-event-indicator">
						<p>
							{(currentHour >= nextEvent.start && (currentHour < nextEvent.end)) ? 'Aktueller' : 'Nächster'} Kurs: <b>{nextEvent.course.name}</b> um <b>{formatTime(nextEvent.start)} Uhr</b>
							{nextEvent.course.room && (
								<>
									{roomOptions ? (
										<span>
											{' im Raum '}<b>{nextEvent.isLecture ? nextEvent.course.room.split('/')[0] : nextEvent.course.room.split('/')[1]}</b>
										</span>
									) : (
										<span> im Raum <b>{nextEvent.course.room}</b></span>
									)}
								</>
							)}
						</p>
					</div>
				)}
				{!nextEvent && (
					<div className="next-event-indicator">
						<p>
							Heute keine Kurse mehr.
						</p>
					</div>
				)}
			</div>
		);
	};

	const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];

	const renderCoursesWithoutSchedule = () => {
		if (coursesWithoutSchedule.length === 0) return null;
		
		return (
			<div className="courses-without-schedule">
				<span>Folgende Kurse die ausgewählt wurden, haben noch keinen Zeitplan zugewiesen bekommen: </span>
				<span className='course' >{coursesWithoutSchedule.map(course => course.name).join(', ')}</span>
			</div>
		);
	};

	const formatTime = (time: number) => {
		const hours = Math.floor(time);
		const minutes = Math.round((time - hours) * 60);
		return `${hours}:${minutes.toString().padStart(2, '0')}`;
	};

	const generateTimeSlots = () => {
		const slots = [];
		for (let hour = 8; hour < 18; hour++) {
			slots.push({
				start: hour,
				end: hour + 1
			});
		}
		return slots;
	};

	const getItemsForTimeSlot = (day: string, slotIndex: number) => {
		const startHour = slotIndex + 8;
		
		return scheduleItems
			.filter(item => item.day === day && 
				item.start >= startHour && 
				item.start < startHour + 1)
			.map(item => {
				const duration = item.end - item.start;
				const rowSpan = Math.ceil(duration);
				
				return {
					item,
					rowSpan
				};
			});
	};

	const skipCells: { [key: string]: boolean } = {}; // track which cells should be skipped due to rowspan

	if (isMobile) {
		const sortDaysFromToday = (days: string[]): string[] => {
			const today = new Date().getDay();
			const todayIndex = today === 0 ? 5 : today - 1;

			return days.sort((a: string, b: string) => {
				const aDist = (weekDays.indexOf(a) - todayIndex + 5) % 5;
				const bDist = (weekDays.indexOf(b) - todayIndex + 5) % 5;

				return aDist - bDist;
			});
		};

		return (
			<>
				{nextEventIndicator()}
				<div className="mobile-schedule">
					{Object.keys(groupedScheduleItems).length === 0 ? (
						<p>Keine Kurse ausgewählt.</p>
					) : (
						sortDaysFromToday(Object.keys(groupedScheduleItems)).map(day => (
							<div key={day} className="mobile-schedule-day-group">
								<h3>{day} {weekDays[new Date().getDay() - 1] == day ? '(Heute)' : ''}</h3>
								{groupedScheduleItems[day]
									.sort((a, b) => a.start - b.start)
									.map((item, index) => (
									<div key={index} className={`mobile-schedule-item ${item.isLecture ? 'lecture' : 'tutorial'}`}>
										<div className="mobile-schedule-time">
											{`${formatTime(item.start)} - ${formatTime(item.end)}`} im <span></span>
												{item.course.room && (
													<span className="room-info">
														{item.course.room.includes('/') 
															? (item.isLecture ? item.course.room.split('/')[0] : item.course.room.split('/')[1])
															: item.course.room	}
													</span>
												)}
										</div>
										<div className="mobile-schedule-course">
											<div className="course-name">
												{item.course.name}
											</div>
											<div className="course-type">
											<span className={`type-badge ${
													item.course.type === CourseType.LECTURE ? (item.isLecture ? 'lecture-badge' : 'tutorial-badge') :
													item.course.type === CourseType.SEMINARY ? 'seminary-badge-schedule' :
													item.course.type === CourseType.PROJECT ? 'project-badge' : ''
												}`}>
												{item.course.type == CourseType.LECTURE ? ( item.isLecture ? 'V' : 'Ü') : (
													item.course.type == CourseType.SEMINARY ? 'S' : (item.course.type == CourseType.PROJECT ? 'P' : ''))
												}
											</span>
											</div>
										</div>
									</div>
								))}
							</div>
						))
					)}
				</div>
				{renderCoursesWithoutSchedule()}
			</>
		);
	}

	const timeSlots = generateTimeSlots();

	return (
		<>
			{nextEventIndicator()}
			<div className="schedule-container" style={{ position: 'relative' }}>
				<table className="schedule">
					<thead>
						<tr className='scheduleHeader' >
							<th>Zeit</th>
							<th>Montag</th>
							<th>Dienstag</th>
							<th>Mittwoch</th>
							<th>Donnerstag</th>
							<th>Freitag</th>
						</tr>
					</thead>
					<tbody className="schedule-body">
						{currentTimePosition >= 0 && (
							<tr
								className="current-time-line"
								style={{
									top: `calc(${currentTimePosition / 100 * document.getElementsByClassName('schedule-body')[0]?.clientHeight + document.getElementsByClassName('scheduleHeader')[0]?.clientHeight}px)`,
									position: 'absolute',
									left: 0,
									right: 0,
									height: '2px',
									backgroundColor: 'red',
									zIndex: 1,
									opacity: 0.3,
								}}
							></tr>
						)}
						{timeSlots.map((slot, slotIndex) => (
							<tr key={slotIndex} className='schedule-row'>
								{/* <td>{`${formatTime(slot.start)}`}</td> */}
								<td className={slot.start % 2 === 1 ? 'time-soft' : ''}>{`${formatTime(slot.start)}`}</td>
								{/* { slot.start % 2 === 0 ? <td>{`${formatTime(slot.start)}`}</td> : <td></td> } */}
								{['Mo', 'Di', 'Mi', 'Do', 'Fr'].map(day => {
									const cellKey = `${day}-${slotIndex}`;
									
									if (skipCells[cellKey]) {
										return null;
									}
									
									const itemsInSlot = getItemsForTimeSlot(day, slotIndex);
									
									if (itemsInSlot.length > 0) {
										const { item, rowSpan } = itemsInSlot[0];
										
										for (let i = 1; i < rowSpan && slotIndex + i < timeSlots.length; i++) {
											skipCells[`${day}-${slotIndex + i}`] = true;
										}
										
										return (
											<td 
												key={cellKey} 
												className={item.isLecture ? 'lecture' : 'tutorial'}
												rowSpan={Math.min(rowSpan, timeSlots.length - slotIndex)}
											>
												<div className="course-name">{item.course.name}</div>
												<div className="course-time">
													{formatTime(item.start)}-{formatTime(item.end)} im <span></span>
													{item.course.room && (
														<span className="room-info">
															{item.course.room.includes('/') 
																? (item.isLecture ? item.course.room.split('/')[0] : item.course.room.split('/')[1])
																: item.course.room	}
														</span>
													)}
												</div>
												<div className="course-type">
												<span className={`type-badge ${
													item.course.type === CourseType.LECTURE ? (item.isLecture ? 'lecture-badge' : 'tutorial-badge') :
													item.course.type === CourseType.SEMINARY ? 'seminary-badge-schedule' :
													item.course.type === CourseType.PROJECT ? 'project-badge' : ''
												}`}>
													{item.course.type == CourseType.LECTURE ? ( item.isLecture ? 'V' : 'Ü') : (
														item.course.type == CourseType.SEMINARY ? 'S' : (item.course.type == CourseType.PROJECT ? 'P' : ''))
													}
												</span>
												</div>
											</td>
										);
									}
									
									return <td key={cellKey}></td>;
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{renderCoursesWithoutSchedule()}
		</>
	);
};

export default Schedule;