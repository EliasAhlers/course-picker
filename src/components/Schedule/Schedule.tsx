import React, { useEffect, useState } from 'react';
import useScheduleGenerator from '../../hooks/useScheduleGenerator';
import './Schedule.css';
import { Semester } from '../../utils/enums';

interface ScheduleProps {
	selectedCourseIds: number[];
	selectedSemester: string;
	isMobile: boolean;
}

const Schedule: React.FC<ScheduleProps> = ({ selectedCourseIds, selectedSemester, isMobile }) => {
	const { scheduleItems, groupedScheduleItems } = useScheduleGenerator(selectedCourseIds, selectedSemester);

	const [currentTimePosition, setCurrentTimePosition] = useState(0);

	useEffect(() => {
		const updateCurrentTimePosition = () => {
			const now = new Date();
			const currentHour = now.getHours();
			if (currentHour >= 10 && currentHour <= 18) {
				const position = ((currentHour - 10) / 8) * 100;
				setCurrentTimePosition(position);
			} else {
				setCurrentTimePosition(-1);
			}
		};

		updateCurrentTimePosition();
		const interval = setInterval(updateCurrentTimePosition, 60 * 1000);

		return () => clearInterval(interval);
	}, []);

	if (selectedSemester !== Semester.WiSe2425) {
		return (
			<div className="disclaimer">
				<b>Hinweis:</b> Für das Semester {selectedSemester} sind noch keine Zeiten vorhanden, daher kann kein Stundenplan angezeigt werden.
			</div>
		);
	}

	const nextEventIndicator = () => {
		const now = new Date();
		const currentHour = now.getHours();
		const currentDay = now.toLocaleDateString('de-DE', { weekday: 'short' });

		const nextEvent = scheduleItems.find(item => item.day === currentDay && item.start > currentHour - 2);

		const roomOptions: boolean = nextEvent?.course.room ? nextEvent.course.room.includes('/') : false;


		return (
			<div>
				{nextEvent && (
					<div className="next-event-indicator">
						<p>
							{(currentHour >= nextEvent.start && (currentHour < nextEvent.start + 2)) ? 'Aktueller' : 'Nächster'} Kurs: <b>{nextEvent.course.name}</b> um <b>{nextEvent.start}:00 Uhr</b>
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
								{groupedScheduleItems[day].map((item, index) => (
									<div key={index} className={`mobile-schedule-item ${item.isLecture ? 'lecture' : 'tutorial'}`}>
										<div className="mobile-schedule-time">{`${item.start}:00 - ${item.end}:00`}</div>
										<div className="mobile-schedule-course">
											<div className="course-name">{item.course.name}</div>
											<div className="course-type">
												<span className={`type-badge ${item.isLecture ? 'lecture-badge' : 'tutorial-badge'}`}>
													{item.isLecture ? 'V' : 'Ü'}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						))
					)}
				</div>
			</>
		);
	}

	const timeSlots = [
		{ start: 10, end: 12 },
		{ start: 12, end: 14 },
		{ start: 14, end: 16 },
		{ start: 16, end: 18 }
	];

	return (
		<>
			{nextEventIndicator()}
			<div className="schedule-container" style={{ position: 'relative' }}>
				{currentTimePosition >= 0 && (
					<div
						className="current-time-line"
						style={{
							top: `calc(${currentTimePosition}% + ${document.getElementsByClassName('scheduleHeader')[0]?.clientHeight ?? 50}px)`,
							position: 'absolute',
							left: 0,
							right: 0,
							height: '2px',
							backgroundColor: 'red',
							zIndex: 1,
							opacity: 0.3,
						}}
					></div>
				)}
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
					<tbody>
						{timeSlots.length === 0 ? (
							<tr>
								<td colSpan={6}>Keine Kurse ausgewählt.</td>
							</tr>
						) : (
							timeSlots.map((slot) => (
								<tr key={slot.start}>
									<td>{`${slot.start}:00 - ${slot.end}:00`}</td>
									{['Mo', 'Di', 'Mi', 'Do', 'Fr'].map(day => {
										const item = scheduleItems.find(i => i.day === day && i.start === slot.start);
										return (
											<td key={day} className={item ? (item.isLecture ? 'lecture' : 'tutorial') : ''}>
												{item && (
													<>
														<div className="course-name">{item.course.name}</div>
														<div className="course-type">
															<span className={`type-badge ${item.isLecture ? 'lecture-badge' : 'tutorial-badge'}`}>
																{item.isLecture ? 'V' : 'Ü'}
															</span>
														</div>
													</>
												)}
											</td>
										);
									})}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default Schedule;