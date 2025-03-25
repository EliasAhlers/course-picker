import { Course } from "../types";

export const generateCoursesFile = (courses: Course[], removedCourseIds: number[]): string => {
	const sortedCourses = [...courses].sort((a, b) => a.id - b.id);

	let fileContent = `import { Course, CourseType, Semester } from "./types";\n\n`;

	fileContent += `export const removedCourseIds: number[] = [\n`;
	if (removedCourseIds.length > 0) {
		fileContent += `\t${removedCourseIds.join(',\n\t')}\n`;
	}
	fileContent += `];\n\n`;

	fileContent += `export const courses: Course[] = [\n`;

	const coursesBySemester = sortedCourses.reduce((acc, course) => {
		if (!acc[course.semester]) {
			acc[course.semester] = [];
		}
		acc[course.semester].push(course);
		return acc;
	}, {} as Record<string, Course[]>);

	const semesters = Object.keys(coursesBySemester);

	semesters.forEach((semester, index) => {
		if (index > 0) {
			fileContent += '\n';
		}

		fileContent += `\t// ====================== ${semester} ======================\n`;

		coursesBySemester[semester].sort((a, b) => -1*a.domain.localeCompare(b.domain));

		coursesBySemester[semester].forEach(course => {
			const courseTypeFormatted = course.type.toUpperCase();

			let courseStr = `\t{ id: ${course.id}, type: CourseType.${courseTypeFormatted}, name: "${course.name}", instructor: "${course.instructor}", domain: "${course.domain}", semester: Semester.${semester}, cp: ${course.cp}`;

			if (course.schedule) courseStr += `, schedule: "${course.schedule}"`;
			if (course.tutorial) courseStr += `, tutorial: "${course.tutorial}"`;
			if (course.room) courseStr += `, room: "${course.room}"`;
			if (course.bachelor) courseStr += `, bachelor: true`;
			if (course.dependsOn !== undefined) courseStr += `, dependsOn: ${course.dependsOn}`;

			courseStr += ` },\n`;
			fileContent += courseStr;
		});
	});

	fileContent += `];\n`;

	return fileContent;
};