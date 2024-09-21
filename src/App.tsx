import React, { useState, useEffect } from 'react';
import { Course, Conflict, ScheduleItem } from './types';
import './App.css';

const courses: Course[] = [
	{ id: 1, name: "Empirical Security Analysis and Engineering", instructor: "Holz", domain: "PI", semester: "WiSe 24/25", cp: 6, schedule: "Mo 12-14, Mi 12-14" },
	{ id: 2, name: "Visualisierung", instructor: "Linsen", domain: "PI", semester: "WiSe 24/25", cp: 9, schedule: "Di 10-12, Fr 10-12", tutorial: "Mi 10-12" },
	{ id: 3, name: "Computer Vision", instructor: "Jiang", domain: "PI", semester: "WiSe 24/25", cp: 9, schedule: "Mo 10-12, Do 10-12" },
	{ id: 4, name: "Deep Reinforcement Learning", instructor: "Schilling", domain: "PI", semester: "WiSe 24/25", cp: 6, schedule: "Di 10-12, Fr 10-12", tutorial: "Mi 10-12" },
	{ id: 5, name: "Verteilte Systeme", instructor: "Gorlatch", domain: "PI", semester: "WiSe 24/25", cp: 6, schedule: "Di 16-18", tutorial: "Mi 16-18" },
	{ id: 6, name: "Algorithmische Geometrie", instructor: "Varenhold", domain: "FM", semester: "WiSe 24/25", cp: 9, schedule: "Mo 12-14, Do 12-14", tutorial: "Fr 10-12" },
	{ id: 7, name: "Modellierung und Analyse von dynamischen Systemen", instructor: "Remke", domain: "FM", semester: "WiSe 24/25", cp: 9, schedule: "Di 12-14, Fr 12-14", tutorial: "Do 12-14" },
	{ id: 8, name: "Theorie der Programmierung", instructor: "Müller-Olm", domain: "FM", semester: "SoSe 25", cp: 9 },
	{ id: 9, name: "Aus dem Bereich Algorithmik", instructor: "", domain: "FM", semester: "SoSe 25", cp: 6 },
	{ id: 10, name: "Quantitatives Model Checking", instructor: "Remke", domain: "FM", semester: "SoSe 25", cp: 6 },
	{ id: 11, name: "Parallele Systeme", instructor: "Gorlatch", domain: "PI", semester: "SoSe 25", cp: 9 },
	{ id: 12, name: "Visual Analytics", instructor: "Linsen", domain: "PI", semester: "SoSe 25", cp: 6 },
	{ id: 13, name: "Algorithmik", instructor: "", domain: "FM", semester: "WiSe 25/26", cp: 9 },
	{ id: 14, name: "Automated Planning and Acting", instructor: "Braun", domain: "FM", semester: "WiSe 25/26", cp: 6 },
	{ id: 15, name: "Lambda-Kalkül und funkt. Sprachen", instructor: "Lammers", domain: "FM", semester: "WiSe 25/26", cp: 6 },
	{ id: 16, name: "Computer Vision", instructor: "Jiang", domain: "PI", semester: "WiSe 25/26", cp: 9 },
	{ id: 17, name: "Deep Reinforcement Learning", instructor: "Schilling", domain: "PI", semester: "WiSe 25/26", cp: 6 },
	{ id: 18, name: "Sicherheit in eingebetteten Systemen", instructor: "Herber", domain: "PI", semester: "WiSe 25/26", cp: 6 }
];

const App: React.FC = () => {
	const [selectedCourses, setSelectedCourses] = useState<Course[]>(() => {
		const savedCourses = localStorage.getItem('selectedCourses');
		return savedCourses ? JSON.parse(savedCourses) : [];
	});
	const [conflicts, setConflicts] = useState<Conflict[]>([]);
	const [selectedSemester, setSelectedSemester] = useState<string>("WiSe 24/25");
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const newConflicts = detectConflicts(selectedCourses);
		setConflicts(newConflicts);
		localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
	}, [selectedCourses]);

	const handleCourseToggle = (course: Course) => {
		setSelectedCourses(prev =>
			prev.some(c => c.id === course.id)
				? prev.filter(c => c.id !== course.id)
				: [...prev, course]
		);
	};

	const detectConflicts = (courses: Course[]): Conflict[] => {
		const conflicts: Conflict[] = [];
		for (let i = 0; i < courses.length; i++) {
			for (let j = i + 1; j < courses.length; j++) {
				if (hasTimeConflict(courses[i], courses[j])) {
					conflicts.push([courses[i].id, courses[j].id]);
				}
			}
		}
		return conflicts;
	};

	const hasTimeConflict = (course1: Course, course2: Course): boolean => {
		if (!course1.schedule || !course2.schedule) return false;
		if (course1.semester !== course2.semester) return false;

		const times1 = getCourseTimes(course1);
		const times2 = getCourseTimes(course2);

		for (const time1 of times1) {
			for (const time2 of times2) {
				if (time1.day === time2.day &&
					((time1.start <= time2.start && time2.start < time1.end) ||
						(time2.start <= time1.start && time1.start < time2.end))) {
					return true;
				}
			}
		}
		return false;
	};

	const getCourseTimes = (course: Course) => {
		const times: { day: string; start: number; end: number }[] = [];
		const addTimes = (zeitString?: string) => {
			if (!zeitString) return;
			const parts = zeitString.split(', ');
			for (const part of parts) {
				const [day, time] = part.split(' ');
				const [start, end] = time.split('-').map(Number);
				times.push({ day, start, end });
			}
		};
		addTimes(course.schedule);
		addTimes(course.tutorial);
		return times;
	};

	const totalCP = selectedCourses.reduce((sum, course) => sum + course.cp, 0);
	const fmCP = selectedCourses.filter(course => course.domain === "FM").reduce((sum, course) => sum + course.cp, 0);
	const piCP = selectedCourses.filter(course => course.domain === "PI").reduce((sum, course) => sum + course.cp, 0);

	const isDuplicateSelected = (course: Course) => {
		return selectedCourses.some(c => c.name === course.name && c.id !== course.id);
	};

	const isConflict = (courseId: number) => {
		return conflicts.some(conflict => conflict.includes(courseId));
	};

	const getSemesterClass = (semester: string): string => {
		const cleanSemester = semester.replace(/\s/g, '-').replace('/', '-');
		return `semester-${cleanSemester}`;
	};

	const generateSchedule = (courses: Course[], semester: string): ScheduleItem[] => {
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

	const scheduleItems = generateSchedule(selectedCourses, selectedSemester);
	const groupedScheduleItems = groupScheduleItemsByDay(scheduleItems);

	const uniqueTimes = Array.from(new Set(scheduleItems.map(item => item.start))).sort((a, b) => a - b);

	return (
		<div className="App">
			<h1>Vorlesungsauswahl-Tool für den Bereich "Kerninformatik"</h1>

			<div className="disclaimer">
				<b>Hinweis:</b> Ich übernehme keine Verantwortung für die Richtigkeit der Daten oder eventuelle Fehler! Besonders bei den CP bin ich mir nicht sicher, ob sie korrekt sind.
				<br></br>
				<br></br>
				Alle Daten bleiben lokal im Browser gespeichert und werden nicht an einen Server gesendet. Beim Löschen des Browserspeichers für diese Seite gehen alle Daten verloren!
			</div>

			<div className="disclaimer">
				<b>Hinweis:</b> Aktuell sind noch nicht alle Daten vorhanden, es fehlen noch einige Zeiten für das WiSe 24/25! Sobald ich diese weiß, trage ich sie nach.
			</div>

			<h2>Fortschritt</h2>
			<ProgressBar label="Gesamte CP" current={totalCP} max={51} />
			<ProgressBar label="Formale Methoden CP" current={fmCP} max={15} />
			<ProgressBar label="Praktische Informatik CP" current={piCP} max={15} />

			{conflicts.length > 0 && (
				<div className="warning">
					<b>Achtung:</b> Es gibt Zeitüberschneidungen zwischen ausgewählten Kursen!
					<ul>
						{conflicts.map(([id1, id2]) => (
							<li key={`${id1}-${id2}`}>
								{courses.find(c => c.id === id1)?.name} und {courses.find(c => c.id === id2)?.name}
							</li>
						))}
					</ul>
				</div>
			)}

			<h2>Stundenplan
				<select
					value={selectedSemester}
					onChange={(e) => setSelectedSemester(e.target.value)}
				>
					<option value="WiSe 24/25">WiSe 24/25</option>
					<option value="SoSe 25">SoSe 25</option>
					<option value="WiSe 25/26">WiSe 25/26</option>
				</select>
			</h2>
			{isMobile ? (
				<div className="mobile-schedule">
					{Object.entries(groupedScheduleItems).map(([day, items]) => (
						<div key={day} className="mobile-schedule-day-group">
							<h3>{day}</h3>
							{items.map((item, index) => (
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
					))}
				</div>
			) : (
				<table className="schedule">
					<thead>
						<tr>
							<th>Zeit</th>
							<th>Montag</th>
							<th>Dienstag</th>
							<th>Mittwoch</th>
							<th>Donnerstag</th>
							<th>Freitag</th>
						</tr>
					</thead>
					<tbody>
						{uniqueTimes.map((time) => (
							<tr key={time}>
								<td>{`${time}:00 - ${time + 2}:00`}</td>
								{['Mo', 'Di', 'Mi', 'Do', 'Fr'].map(day => {
									const item = scheduleItems.find(i => i.day === day && i.start === time);
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
						))}
					</tbody>
				</table>
			)}

			<h2>Verfügbare Vorlesungen</h2>
			<div className="table-container">
				<table className="responsive-table">
					<thead>
						<tr>
							<th>Auswahl</th>
							<th>Name</th>
							<th>Dozent</th>
							<th>Bereich</th>
							<th>Semester</th>
							<th>CP</th>
							<th>Zeit</th>
							<th>Übung</th>
						</tr>
					</thead>
					<tbody>
						{courses.map(course => (
							<tr key={course.id} className={`
      ${course.domain} 
      ${isDuplicateSelected(course) ? 'duplicate' : ''}
      ${isConflict(course.id) ? 'conflict' : ''}
    `}>
								<td data-label="Auswahl">
									<input
										type="checkbox"
										checked={selectedCourses.some(c => c.id === course.id)}
										onChange={() => handleCourseToggle(course)}
										disabled={isDuplicateSelected(course)}
									/>
								</td>
								<td data-label="Name">
									<div className="course-name">{course.name}</div>
								</td>
								<td data-label="Dozent" className="instructor">{course.instructor}</td>
								<td data-label="Bereich"><span className="domain-badge">{course.domain}</span></td>
								<td data-label="Semester">
									<span className={`semester-badge ${getSemesterClass(course.semester)}`}>
										{course.semester}
									</span>
								</td>
								<td data-label="CP">{course.cp}</td>
								<td data-label="Zeit">{course.schedule || '?'}</td>
								<td data-label="Übung">{course.tutorial || '?'}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<footer className="copyright">
				2024 Elias Ahlers
			</footer>
		</div>
	);
};

const ProgressBar: React.FC<{ label: string; current: number; max: number }> = ({ label, current, max }) => (
	<div>
		<p>{label}: {current}/{max}</p>
		<div className="progress-bar">
			<div className="progress" style={{ width: `${Math.min(current / max * 100, 100)}%` }}>
				<span>{Math.round(current / max * 100)}%</span>
			</div>
		</div>
	</div>
);

export default App;