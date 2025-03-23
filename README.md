# Vorlesungsauswahl-Tool für Kerninformatik

## Overview
This React-based web application helps students at the University of Münster select courses from the "Kerninformatik" area. It provides a visual schedule, tracks credit points and alerts students to potential time conflicts between courses.

## Features
- Course selection interface
- Visual schedule display
- Credit point tracking for total CP, Formal Methods, and Practical Computer Science
- Conflict detection for overlapping course times
- Local storage of selected courses
- Responsive design for mobile and desktop use

## Development
This project is built using React and TypeScript. To run it locally:

1. Run `bun install` to install dependencies
2. Use `bun run dev` to run the app

### Building & Deployment
To build the app for production, run `bun run build`. This will create a `dist` folder with the compiled files.
I also have a deployment script that uses scp to prepare my server and deploy the app. You can use it via `bun run deploy`.

## Disclaimer
This tool is for planning purposes only. The accuracy of course data is not guaranteed, and users should verify all information with official university sources.

## License
The code in this repo is licensed under the MIT License.

To view a copy of this license, visit: https://opensource.org/licenses/MIT

Elias-Leander Ahlers, 2025