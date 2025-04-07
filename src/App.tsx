import React, { useState, useEffect } from 'react';
import { Course, CourseType, Semester, CustomEvent, CustomEventType } from './types';
import { courses, removedCourseIds } from './courses';
import CourseList from './components/CourseList/CourseList';
import ProgressBar from './components/ProgressBar/ProgressBar';
import Schedule from './components/Schedule/Schedule';
import ConflictWarning from './components/ConflictWarning/ConflictWarning';
import useLocalStorage from './hooks/useLocalStorage';
import useConflictDetection from './hooks/useConflictDetection';
import './App.css';
import SemesterTable from './components/SemesterTable/SemesterTable';
import CustomEventsTable from './components/CustomEventsTable/CustomEventsTable';
import { SyncButton } from './components/SyncButton/SyncButton';
import { getMotd } from './utils/pocketbase';
import SemesterLabel from './components/SemesterLabel/SemesterLabel';
import CourseEditor from './components/CourseEditor/CourseEditor';

const MAX_LECTURES = 11;

const App: React.FC = () => {
	const [selectedCourseIds, setSelectedCourseIds] = useLocalStorage<number[]>('selectedCourseIds', []);
	const [selectedSemesterSchedule, setSelectedSemesterSchedule] = useState<string>(Semester.SoSe25);
	const [selectedSemesterList, setSelectedSemesterList] = useState<string>('all');
	const [showBachelorCourses, setShowBachelorCourses] = useLocalStorage<boolean>('showBachelorCourses', false);
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

	const [hiddenBachelorWarning, setHiddenBachelorWarning] = useState<boolean>(false);
	const [maxLecturesWarning, setMaxLecturesWarning] = useState<boolean>(false);

	const conflicts = useConflictDetection(selectedCourseIds);

	const [customEvents, setCustomEvents] = useLocalStorage<CustomEvent[]>('customEvents', []);

	const [motd, setMotd] = useState<{text: string, attention: boolean}>({text: '', attention: false});
	const [showCourseEditor, setShowCourseEditor] = useState<boolean>(false);

	const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		// Handle migration of old localStorage data
		const oldLocalData = localStorage.getItem('selectedCourses');
		if (oldLocalData != null) {
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

	useEffect(() => {
		getMotd().then((val) => {
			if(val) {
				setMotd(val);
			}
		});
	}, []);

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
	const fmCP = selectedCourseIds.map(courseId => courses.find(course => course.id === courseId)).filter(course => course?.domain === "FM" && (course?.type == CourseType.LECTURE || course?.type == CourseType.PRACTICAL)).reduce((sum, course) => sum + course!.cp, 0) +
		customEvents.filter(event => event.type === CustomEventType.FM_LECTURE).reduce((sum, event) => sum + event.cp, 0);
	const piCP = selectedCourseIds.map(courseId => courses.find(course => course.id === courseId)).filter(course => course?.domain === "PI" && (course?.type == CourseType.LECTURE || course?.type == CourseType.PRACTICAL)).reduce((sum, course) => sum + course!.cp, 0) +
		customEvents.filter(event => event.type === CustomEventType.PI_LECTURE).reduce((sum, event) => sum + event.cp, 0);

	const akCP = customEvents.filter(event => event.type === CustomEventType.GENERAL).reduce((sum, event) => sum + event.cp, 0);

	const seminarySelected = selectedCourseIds.some(courseId => courses.find(course => course.id === courseId)?.type === CourseType.SEMINARY);
	const projectSelected = selectedCourseIds.some(courseId => courses.find(course => course.id === courseId)?.type === CourseType.PROJECT);
	const thesisSelected = selectedCourseIds.some(courseId => courses.find(course => course.id === courseId)?.type === CourseType.THESIS);

	return (
		<div className="App">
			<h1>Vorlesungsauswahl-Tool für den Informatik Master Uni Münster</h1>

			<div className="disclaimer">
				<b>Hinweis:</b> Ich übernehme keine Verantwortung für die Richtigkeit der Daten oder eventuelle Fehler! Besonders bei den CP bin ich mir nicht sicher, ob sie korrekt sind, einige sind Schätzungen. <b>Letztes Update: 24.03.2025</b>
				<br /><br />
				Alle Daten bleiben lokal im Browser gespeichert und werden nicht an einen Server gesendet. Beim Löschen des Browserspeichers für diese Seite gehen alle Daten verloren! <br></br>
				<b>Ausnahme:</b> Wenn du die Sync-Funktion nutzt, werden deine Daten und zusätzliche personenbezogene Daten wie deine IP-Adresse auf einem Server gespeichert. Diese Daten werden nicht an Dritte weitergegeben und nur für die Sync-Funktion genutzt.
			</div>

			<SyncButton
				data={{
					selectedCourseIds,
					customEvents,
					showBachelorCourses
				}}
				onSync={(data) => {
					setSelectedCourseIds(data.selectedCourseIds);
					setCustomEvents(data.customEvents);
					setShowBachelorCourses(data.showBachelorCourses);
				}}
			/>
			<div className="app-controls">
				{isLocalhost && (
					<button 
						className="edit-courses-button" 
						onClick={() => setShowCourseEditor(true)}
						title="Veranstaltungsdaten bearbeiten"
					>
						Veranstaltungen bearbeiten
					</button>
				)}
			</div>

			{ 
				motd.text != '' ? 
				<div className={ 'disclaimer' +( motd.attention ? ' attention' : '') }>
					{motd.text}
				</div>
				: ''
			}

			<h2>
				<span className="spacer">Stundenplan</span>
				<select
					value={selectedSemesterSchedule}
					onChange={(e) => setSelectedSemesterSchedule(e.target.value)}
				>
					{
						Object.keys(Semester).map((key) => (
							<option key={key} value={key} selected={key === Semester[key as keyof typeof Semester]}>
								<SemesterLabel semester={key} />
							</option>
						))
					}
				</select>
			</h2>

			<Schedule
				selectedCourseIds={selectedCourseIds}
				selectedSemester={selectedSemesterSchedule}
				isMobile={isMobile}
				customEvents={customEvents}
			/>

			<table>
				<thead>
					<tr>
						<th>Bedingungen (Bereich "Kerninformatik")</th>
						<th>Bedingungen (Sonstige)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<ProgressBar label="Gesamte CP" current={totalCP} max={51} />
							<ProgressBar label="Formale Methoden CP" current={fmCP} max={15} />
							<ProgressBar label="Praktische Informatik CP" current={piCP} max={15} />
						</td>
						<td className='align-top'>
							Informatikseminar belegt: <span className={seminarySelected ? 'conditionMet' : 'conditionNotMet'} >{seminarySelected ? 'Ja' : 'Nein'}</span><br />
							Projektseminar belegt:    <span className={projectSelected ? 'conditionMet' : 'conditionNotMet'} >{projectSelected ? 'Ja' : 'Nein'}</span><br />
							Masterarbeit belegt:      <span className={thesisSelected ? 'conditionMet' : 'conditionNotMet'} >{thesisSelected ? 'Ja' : 'Nein'}</span>
							<ProgressBar label="Zusatzkompetenzen CP" current={akCP} max={18} />
						</td>
					</tr>
				</tbody>
			</table>

			<ConflictWarning conflicts={conflicts} courses={courses} />

			<h2>CP pro Semester</h2>
			<SemesterTable
				selectedCourseIds={selectedCourseIds}
				customEvents={customEvents}
			/>

			<h2>Eigene Veranstaltungen</h2>
			<div className="disclaimer">
				Hier können z.B. Zusatzkompetenzen oder andere Veranstaltungen eingetragen werden, die nicht in der Liste sind.
				Diese werden nicht auf Konflikte überprüft, aber in die CP pro Semester eingerechnet.
			</div>
			<CustomEventsTable
				customEvents={customEvents}
				setCustomEvents={setCustomEvents}
			/>

			{maxLecturesWarning && (
				<div className="warning">
					<b>Achtung:</b> Es sind mehr als {MAX_LECTURES} Vorlesungen ausgewählt. Bitte beachten, dass du nach PO maximal {MAX_LECTURES} Vorlesungen belegen kannst!
				</div>
			)}

			<h2>Verfügbare Veranstaltungen</h2>
			<div className="controls">
				<span style={{paddingRight: '0.25em'}}>Semester:</span>
				<select
					value={selectedSemesterList}
					onChange={(e) => setSelectedSemesterList(e.target.value)}
				>
					{
						Object.keys(Semester).map((key) => (
							<option key={key} value={key} selected={key === Semester[key as keyof typeof Semester]}>
								<SemesterLabel semester={key} />
							</option>
						))
					}
					<option value="all">Alle Semester</option>
				</select>
				<label style={{paddingLeft: '1em'}}>
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
				semesterFilter={selectedSemesterList}
				onCourseToggle={handleCourseToggle}
				conflicts={conflicts}
			/>

			<CourseEditor 
				isOpen={showCourseEditor} 
				onClose={() => setShowCourseEditor(false)} 
			/>

			<footer className="copyright">
				2025 Elias-Leander Ahlers - <a href="https://github.com/EliasAhlers/course-picker">GitHub</a> - <a href="https://ahlers.click/#impressum">Impressum</a>
			</footer>
		</div>
	);
};

export default App;