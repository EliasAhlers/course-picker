import React, { useState, useEffect } from 'react';
import { Course } from './types';
import { courses } from './courses';
import CourseList from './components/CourseList/CourseList';
import ProgressBar from './components/ProgressBar/ProgressBar';
import Schedule from './components/Schedule/Schedule';
import ConflictWarning from './components/ConflictWarning/ConflictWarning';
import useLocalStorage from './hooks/useLocalStorage';
import useConflictDetection from './hooks/useConflictDetection';
import './App.css';

const App: React.FC = () => {
  const [selectedCourses, setSelectedCourses] = useLocalStorage<Course[]>('selectedCourses', []);
  const [selectedSemester, setSelectedSemester] = useState<string>("WiSe 24/25");
  const [showBachelorCourses, setShowBachelorCourses] = useLocalStorage<boolean>('showBachelorCourses', false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  const conflicts = useConflictDetection(selectedCourses, selectedSemester);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCourseToggle = (course: Course) => {
    setSelectedCourses(prev =>
      prev.some(c => c.id === course.id)
        ? prev.filter(c => c.id !== course.id)
        : [...prev, course]
    );
  };

  const totalCP = selectedCourses.reduce((sum, course) => sum + course.cp, 0);
  const fmCP = selectedCourses.filter(course => course.domain === "FM").reduce((sum, course) => sum + course.cp, 0);
  const piCP = selectedCourses.filter(course => course.domain === "PI").reduce((sum, course) => sum + course.cp, 0);

  return (
    <div className="App">
      <h1>Vorlesungsauswahl-Tool für den Bereich "Kerninformatik"</h1>
      
      <div className="disclaimer">
        <b>Hinweis:</b> Ich übernehme keine Verantwortung für die Richtigkeit der Daten oder eventuelle Fehler! Besonders bei den CP bin ich mir nicht sicher, ob sie korrekt sind.
        <br /><br />
        Alle Daten bleiben lokal im Browser gespeichert und werden nicht an einen Server gesendet. Beim Löschen des Browserspeichers für diese Seite gehen alle Daten verloren!
      </div>

      <div className="disclaimer">
        <b>Hinweis:</b> Aktuell sind noch nicht alle Daten vorhanden, es fehlen noch einige Zeiten für das WiSe 24/25! Sobald ich diese weiß, trage ich sie nach.
      </div>

      {isMobile && (
        <div className="disclaimer">
          <b>Hinweis:</b> Obwohl diese Seite für Handys optimiert ist, empfehle ich die Nutzung auf einem größeren Bildschirm, da die Darstellung auf Handys nicht optimal ist.
        </div>
      )}

      <h2>Bedingungen</h2>
      <ProgressBar label="Gesamte CP" current={totalCP} max={51} />
      <ProgressBar label="Formale Methoden CP" current={fmCP} max={15} />
      <ProgressBar label="Praktische Informatik CP" current={piCP} max={15} />

      <ConflictWarning conflicts={conflicts} courses={courses} />

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
        selectedCourses={selectedCourses}
        selectedSemester={selectedSemester}
        isMobile={isMobile}
      />

      <h2>Verfügbare Vorlesungen</h2>
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

      <CourseList
        courses={courses}
        selectedCourses={selectedCourses}
        showBachelorCourses={showBachelorCourses}
        onCourseToggle={handleCourseToggle}
        conflicts={conflicts}
      />

      <footer className="copyright">
        2024 Elias Ahlers - <a href="https://github.com/EliasAhlers/course-picker">GitHub</a>
      </footer>
    </div>
  );
};

export default App;