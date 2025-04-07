import { Course, CourseType, Semester } from "./types";

export const removedCourseIds: number[] = [
	9,
	23,
	28
];

export const courses: Course[] = [
	// ====================== WiSe2425 ======================
	{ id: 1, type: CourseType.LECTURE, name: "Empirical Security Analysis and Engineering", instructor: "Holz", domain: "PI", semester: Semester.WiSe2425, cp: 6, schedule: "Mo 12-14", tutorial: "Mi 12-14", room: "M6/M3" },
	{ id: 2, type: CourseType.LECTURE, name: "Visualisierung", instructor: "Linsen", domain: "PI", semester: Semester.WiSe2425, cp: 9, schedule: "Di 10-12, Fr 10-12", tutorial: "Mi 10-12" },
	{ id: 3, type: CourseType.LECTURE, name: "Computer Vision", instructor: "Jiang", domain: "PI", semester: Semester.WiSe2425, cp: 6, schedule: "Mo 10-12, Do 10-12", room: "M1" },
	{ id: 4, type: CourseType.LECTURE, name: "Deep Reinforcement Learning", instructor: "Schilling", domain: "PI", semester: Semester.WiSe2425, cp: 6, schedule: "Di 10-12", tutorial: "Mi 10-12", room: "M5/M6" },
	{ id: 5, type: CourseType.LECTURE, name: "Verteilte Systeme", instructor: "Gorlatch", domain: "PI", semester: Semester.WiSe2425, cp: 6, schedule: "Di 16-18", tutorial: "Mo 16-18", room: "M3/M3" },
	{ id: 19, type: CourseType.LECTURE, name: "Eingebettete Systeme", instructor: "Herber", domain: "PI", semester: Semester.WiSe2425, cp: 6, schedule: "Mo 14-16", tutorial: "Do 10-12 oder Do 14-16", bachelor: true },
	{ id: 27, type: CourseType.PRACTICAL, name: "Deep Reinforcement Learning Praktikum", instructor: "Schilling", domain: "PI", semester: Semester.WiSe2425, cp: 3, schedule: "Fr 10-12", dependsOn: 4 },
	{ id: 29, type: CourseType.PRACTICAL, name: "Computer Vision Praktikum", instructor: "Jiang", domain: "PI", semester: Semester.WiSe2425, cp: 3, dependsOn: 3 },
	{ id: 6, type: CourseType.LECTURE, name: "Algorithmische Geometrie", instructor: "Vahrenhold", domain: "FM", semester: Semester.WiSe2425, cp: 9, schedule: "Mo 12-14, Do 12-14", tutorial: "Fr 10-12, Fr 12-14" },
	{ id: 7, type: CourseType.LECTURE, name: "Modellierung und Analyse von dynamischen Systemen", instructor: "Remke", domain: "FM", semester: Semester.WiSe2425, cp: 9, schedule: "Di 12-14, Fr 12-14", tutorial: "Do 12-14", room: "M5/SRZ 202" },
	{ id: 100, type: CourseType.SEMINARY, name: "Informatikseminar WiSe 24/25", instructor: "", domain: "", semester: Semester.WiSe2425, cp: 6 },
	{ id: 101, type: CourseType.PROJECT, name: "Projektseminar WiSe 24/25", instructor: "", domain: "", semester: Semester.WiSe2425, cp: 15 },

	// ====================== SoSe25 ======================
	{ id: 11, type: CourseType.LECTURE, name: "Parallele Systeme", instructor: "Gorlatch", domain: "PI", semester: Semester.SoSe25, cp: 9, schedule: "Di 16-18, Do 16-18", tutorial: "Mi 10-12", room: "M3/M5" },
	{ id: 12, type: CourseType.LECTURE, name: "Visual Analytics", instructor: "Linsen", domain: "PI", semester: Semester.SoSe25, cp: 6, schedule: "Mo 12-14", tutorial: "Do 12-14", room: "M6/M6" },
	{ id: 21, type: CourseType.LECTURE, name: "Computernetze und ihre Leistung", instructor: "Holz", domain: "PI", semester: Semester.SoSe25, cp: 6, schedule: "Mo 12-14", tutorial: "Mi 12-14", room: "M1/M2", bachelor: true },
	{ id: 22, type: CourseType.LECTURE, name: "Einführung in die Computergrafik", instructor: "Linsen", domain: "PI", semester: Semester.SoSe25, cp: 6, schedule: "Di 10-12, Fr 10-12", room: "M6", bachelor: true },
	{ id: 107, type: CourseType.LECTURE, name: "Network and System Security", instructor: "Holz", domain: "PI", semester: Semester.SoSe25, cp: 9, schedule: "Mo 10-12, Do 10-12", tutorial: "Do 12-14", room: "M5" },
	{ id: 8, type: CourseType.LECTURE, name: "Theorie der Programmierung", instructor: "Müller-Olm", domain: "FM", semester: Semester.SoSe25, cp: 9, schedule: "Mo 10-12, Do 10-12", tutorial: "Mi 10-12", room: "M6/M6" },
	{ id: 10, type: CourseType.LECTURE, name: "Einführung in Quantitatives Model Checking", instructor: "Remke", domain: "FM", semester: Semester.SoSe25, cp: 6, schedule: "Di 14-16, Do 14-16", room: "M1/M1", bachelor: true },
	{ id: 20, type: CourseType.LECTURE, name: "Effiziente Algorithmen", instructor: "Vahrenhold", domain: "FM", semester: Semester.SoSe25, cp: 6, schedule: "Di 12-14, Fr 12-14", tutorial: "Fr 12-14", room: "M4/M4", bachelor: true },
	{ id: 24, type: CourseType.LECTURE, name: "Compilerbau", instructor: "Lammers", domain: "FM", semester: Semester.SoSe25, cp: 6, schedule: "Mo 8-10, Do 8-10", room: "M5", bachelor: true },
	{ id: 106, type: CourseType.LECTURE, name: "Mustererkennung", instructor: "Jiang", domain: "FM", semester: Semester.SoSe25, cp: 6, schedule: "Mi 14-16, Fr 10-12", room: "M3", bachelor: true },
	{ id: 170, type: CourseType.PRACTICAL, name: "Mustererkennung Praktikum", instructor: "Jiang", domain: "FM", semester: Semester.SoSe25, cp: 3, dependsOn: 106 },
	{ id: 102, type: CourseType.SEMINARY, name: "Informatikseminar SoSe 25", instructor: "", domain: "", semester: Semester.SoSe25, cp: 6 },
	{ id: 103, type: CourseType.PROJECT, name: "Projektseminar SoSe 25", instructor: "", domain: "", semester: Semester.SoSe25, cp: 15 },
	{ id: 200, type: CourseType.THESIS, name: "Masterarbeit", instructor: "", domain: "", semester: Semester.SoSe25, cp: 27 },
	{ id: 201, type: CourseType.NONE, name: "Masterseminar", instructor: "", domain: "", semester: Semester.SoSe25, cp: 3 },

	// ====================== WiSe2526 ======================
	{ id: 16, type: CourseType.LECTURE, name: "Computer Vision", instructor: "Jiang", domain: "PI", semester: Semester.WiSe2526, cp: 6 },
	{ id: 17, type: CourseType.LECTURE, name: "Deep Reinforcement Learning", instructor: "Schilling", domain: "PI", semester: Semester.WiSe2526, cp: 6 },
	{ id: 18, type: CourseType.LECTURE, name: "Sicherheit in eingebetteten Systemen", instructor: "Herber", domain: "PI", semester: Semester.WiSe2526, cp: 6 },
	{ id: 26, type: CourseType.LECTURE, name: "Simulation von Kommunikationssystemen", instructor: "da Silva", domain: "PI", semester: Semester.WiSe2526, cp: 6, bachelor: true },
	{ id: 108, type: CourseType.PRACTICAL, name: "Computer Vision Praktikum", instructor: "Jiang", domain: "PI", semester: Semester.WiSe2526, cp: 3, dependsOn: 16 },
	{ id: 109, type: CourseType.PRACTICAL, name: "Deep Reinforcement Learning Praktikum", instructor: "Schilling", domain: "PI", semester: Semester.WiSe2526, cp: 3, dependsOn: 17 },
	{ id: 110, type: CourseType.LECTURE, name: "Empirical Security Analysis and Engineering", instructor: "Holz", domain: "PI", semester: Semester.WiSe2526, cp: 6 },
	{ id: 13, type: CourseType.LECTURE, name: "Thema aus dem Bereich Algorithmik", instructor: "", domain: "FM", semester: Semester.WiSe2526, cp: 9 },
	{ id: 14, type: CourseType.LECTURE, name: "Automated Planning and Acting", instructor: "Braun", domain: "FM", semester: Semester.WiSe2526, cp: 6 },
	{ id: 15, type: CourseType.LECTURE, name: "Lambda-Kalkül und funkt. Sprachen", instructor: "Lammers", domain: "FM", semester: Semester.WiSe2526, cp: 6 },
	{ id: 25, type: CourseType.LECTURE, name: "Modellieren mit Automaten und Wahrscheinlichkeiten", instructor: "Remke", domain: "FM", semester: Semester.WiSe2526, cp: 6 },
	{ id: 104, type: CourseType.SEMINARY, name: "Informatikseminar WiSe 25/26", instructor: "", domain: "", semester: Semester.WiSe2526, cp: 6 },
	{ id: 105, type: CourseType.PROJECT, name: "Projektseminar WiSe 25/26", instructor: "", domain: "", semester: Semester.WiSe2526, cp: 15 },
	{ id: 300, type: CourseType.THESIS, name: "Masterarbeit", instructor: "", domain: "", semester: Semester.WiSe2526, cp: 27 },
	{ id: 301, type: CourseType.NONE, name: "Masterseminar", instructor: "", domain: "", semester: Semester.WiSe2526, cp: 3 },

	// ====================== SoSe26 ======================
	{ id: 423, type: CourseType.LECTURE, name: "Eingebettete Systeme", instructor: "Herber", domain: "PI", semester: Semester.SoSe26, cp: 6, bachelor: true },
	{ id: 424, type: CourseType.LECTURE, name: "Computernetze und ihre Leistung", instructor: "Holz", domain: "PI", semester: Semester.SoSe26, cp: 6, bachelor: true },
	{ id: 425, type: CourseType.LECTURE, name: "Autonome Systeme", instructor: "Schilling", domain: "PI", semester: Semester.SoSe26, cp: 6, bachelor: true },
	{ id: 420, type: CourseType.LECTURE, name: "Compilerbau", instructor: "Lammers", domain: "FM", semester: Semester.SoSe26, cp: 6, bachelor: true },
	{ id: 421, type: CourseType.LECTURE, name: "Mustererkennung", instructor: "Jiang", domain: "FM", semester: Semester.SoSe26, cp: 6, bachelor: true },
	{ id: 422, type: CourseType.PRACTICAL, name: "Mustererkennung Praktikum", instructor: "Jiang", domain: "FM", semester: Semester.SoSe26, cp: 3, dependsOn: 421 },
	{ id: 426, type: CourseType.LECTURE, name: "Komplexitätstheorie", instructor: "Müller-Olm", domain: "FM", semester: Semester.SoSe26, cp: 9 },
	{ id: 427, type: CourseType.LECTURE, name: "Simulation und statistisches Model Checking", instructor: "Dr. da Silva", domain: "FM", semester: Semester.SoSe26, cp: 6 },
	{ id: 400, type: CourseType.THESIS, name: "Masterarbeit", instructor: "", domain: "", semester: Semester.SoSe26, cp: 27 },
	{ id: 401, type: CourseType.NONE, name: "Masterseminar", instructor: "", domain: "", semester: Semester.SoSe26, cp: 3 },
	{ id: 470, type: CourseType.SEMINARY, name: "Informatikseminar SoSe 26", instructor: "", domain: "", semester: Semester.SoSe26, cp: 6 },
	{ id: 471, type: CourseType.PROJECT, name: "Projektseminar SoSe 26", instructor: "", domain: "", semester: Semester.SoSe26, cp: 15 },
];
