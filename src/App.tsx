import React, { useState, useEffect } from 'react';
import { Course, CourseType } from './types';
import { courses, removedCourseIds } from './courses';
import CourseList from './components/CourseList/CourseList';
import ProgressBar from './components/ProgressBar/ProgressBar';
import Schedule from './components/Schedule/Schedule';
import ConflictWarning from './components/ConflictWarning/ConflictWarning';
import useLocalStorage from './hooks/useLocalStorage';
import useConflictDetection from './hooks/useConflictDetection';
import './App.css';
import SemesterTable from './components/SemesterTable/SemesterTable';

const MAX_LECTURES = 11;

const App: React.FC = () => {
	const [selectedCourseIds, setSelectedCourseIds] = useLocalStorage<number[]>('selectedCourseIds', []);
	const [selectedSemester, setSelectedSemester] = useState<string>("WiSe 24/25");
	const [showBachelorCourses, setShowBachelorCourses] = useLocalStorage<boolean>('showBachelorCourses', false);
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

	const [hiddenBachelorWarning, setHiddenBachelorWarning] = useState<boolean>(false);
	const [maxLecturesWarning, setMaxLecturesWarning] = useState<boolean>(false);

	const conflicts = useConflictDetection(selectedCourseIds, selectedSemester);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		// Handle migration of old localStorage data
		const oldLocalData = localStorage.getItem('selectedCourses');
		if(oldLocalData != null) {
			const oldSelectedCourses = JSON.parse(oldLocalData) as Course[];
			const oldSelectedCourseIds = oldSelectedCourses.map(course => course.id);
			setSelectedCourseIds(oldSelectedCourseIds);
			localStorage.removeItem('selectedCourses');
			console.log('Migrated old localStorage data to new format');
		}
		// Handle management of deleted courses
		setSelectedCourseIds(prev => prev.filter(id => !removedCourseIds.includes(id)));
	}, []);

	useEffect(() => {
		// Check for hidden bachelor courses
		const hasHiddenBachelorCourses = !showBachelorCourses && selectedCourseIds.some(courseId => courses.find(course => course.id === courseId)?.bachelor);
		setHiddenBachelorWarning(hasHiddenBachelorCourses);

		// Check for max lectures
		const lectureCount = selectedCourseIds.filter(courseId => courses.find(course => course.id === courseId)?.type != CourseType.LECTURE).length;
		setMaxLecturesWarning(lectureCount > MAX_LECTURES);
	}, [showBachelorCourses, selectedCourseIds]);

	const handleCourseToggle = (course: Course) => {
		setSelectedCourseIds(prev => {
			const isSelected = prev.includes(course.id);
			if (isSelected) {
				return prev.filter(id => id !== course.id && courses.find(c => c.id === id)?.dependsOn !== course.id);
			} else {
				if (course.type == CourseType.PRACTICAL) {
					const baseCourse = courses.find(c => c.id === course.dependsOn);
					if (!baseCourse) return prev;
				}
				return [...prev, course.id];
			}
		});
	};


	const totalCP = selectedCourseIds.map(courseId => courses.find(course => course.id === courseId)).filter(course => course?.type == CourseType.LECTURE || course?.type == CourseType.PRACTICAL).reduce((sum, course) => sum + course!.cp, 0);
	const fmCP = selectedCourseIds.map(courseId => courses.find(course => course.id === courseId)).filter(course => course?.domain === "FM" && (course?.type == CourseType.LECTURE || course?.type == CourseType.PRACTICAL)).reduce((sum, course) => sum + course!.cp, 0);
	const piCP = selectedCourseIds.map(courseId => courses.find(course => course.id === courseId)).filter(course => course?.domain === "PI" && (course?.type == CourseType.LECTURE || course?.type == CourseType.PRACTICAL)).reduce((sum, course) => sum + course!.cp, 0);

	const seminarySelected = selectedCourseIds.some(courseId => courses.find(course => course.id === courseId)?.type === CourseType.SEMINARY);
	const projectSelected = selectedCourseIds.some(courseId => courses.find(course => course.id === courseId)?.type === CourseType.PROJECT);

	return (
		<div className="App">
			<h1>Vorlesungsauswahl-Tool für den Informatik Master Uni Münster</h1>

			<div className="disclaimer">
				<b>Hinweis:</b> Ich übernehme keine Verantwortung für die Richtigkeit der Daten oder eventuelle Fehler! Besonders bei den CP bin ich mir nicht sicher, ob sie korrekt sind, einige sind Schätzungen. <b>Letztes Update: 31.01.2025</b>
				<br /><br />
				Alle Daten bleiben lokal im Browser gespeichert und werden nicht an einen Server gesendet. Beim Löschen des Browserspeichers für diese Seite gehen alle Daten verloren!
			</div>

			{/* <div className="disclaimer">
				<b>Hinweis:</b> Aktuell sind noch nicht alle Daten vorhanden, es fehlen noch einige Zeiten für das WiSe 24/25! Sobald ich diese weiß, trage ich sie nach.
			</div> */}

			{isMobile && (
				<div className="disclaimer">
					<b>Hinweis:</b> Obwohl diese Seite für Handys optimiert ist, empfehle ich die Nutzung auf einem größeren Bildschirm, da die Darstellung auf Handys nicht optimal ist.
				</div>
			)}

			<h2>
				<span className="spacer">Stundenplan</span>
				<select
					value={selectedSemester}
					onChange={(e) => setSelectedSemester(e.target.value)}
				>
					<option value="WiSe 24/25">WiSe 24/25</option>
					<option value="SoSe 25">SoSe 25</option>
					<option value="WiSe 25/26">WiSe 25/26</option>
				</select>
			</h2>

			<Schedule
				selectedCourseIds={selectedCourseIds}
				selectedSemester={selectedSemester}
				isMobile={isMobile}
			/>

			<h2>Bedingungen (Bereich "Kerninformatik")</h2>
			<ProgressBar label="Gesamte CP" current={totalCP} max={51} />
			<ProgressBar label="Formale Methoden CP" current={fmCP} max={15} />
			<ProgressBar label="Praktische Informatik CP" current={piCP} max={15} />

			<h2>Bedingungen (Seminare)</h2>
			Informatikseminar belegt: <span className={seminarySelected ? 'conditionMet' : 'conditionNotMet'} >{seminarySelected ? 'Ja' : 'Nein'}</span><br />
			Projektseminar belegt:    <span className={projectSelected ? 'conditionMet' : 'conditionNotMet'} >{projectSelected ? 'Ja' : 'Nein'}</span><br />

			<ConflictWarning conflicts={conflicts} courses={courses} />

			<h2>CP pro Semester</h2>
			<SemesterTable selectedCourseIds={selectedCourseIds} />


			{maxLecturesWarning && (
				<div className="warning">
					<b>Achtung:</b> Es sind mehr als {MAX_LECTURES} Vorlesungen ausgewählt. Bitte beachten, dass du nach PO maximal {MAX_LECTURES} Vorlesungen belegen kannst!
				</div>
			)}

			<h2>Verfügbare Veranstaltungen</h2>
			<div className="controls">
				<label>
					<input
						type="checkbox"
						checked={showBachelorCourses}
						onChange={(e) => setShowBachelorCourses(e.target.checked)}
					/>
					Bachelor-Vorlesungen anzeigen
				</label>
			</div>
			{showBachelorCourses && (
				<div className="disclaimer">
					<b>Hinweis:</b> Bachelorkurse werden nach §8 Absatz 3 der Prüfungsordnung nur auf Antrag anerkannt. Bitte kläre die Anerkennung mit dem Prüfungsamt ab.
				</div>
			)}
			{hiddenBachelorWarning && (
				<div className="warning">
					<b>Achtung:</b> Es sind Bachelor-Vorlesungen ausgewählt, aber die Anzeige von Bachelor-Vorlesungen ist deaktiviert. Diese Vorlesungen werden nicht in der Liste angezeigt, sind aber weiterhin ausgewählt.
				</div>
			)}

			<CourseList
				courses={courses}
				selectedCourseIds={selectedCourseIds}
				showBachelorCourses={showBachelorCourses}
				onCourseToggle={handleCourseToggle}
				conflicts={conflicts}
			/>

			<footer className="copyright">
				2025 Elias Ahlers - <a href="https://github.com/EliasAhlers/course-picker">GitHub</a> - <a href="https://ahlers.click">Impressum</a>
			</footer>
		</div>
	);
};

export default App;