# Project README

## Overview

This project is aimed at creating a production machine events calendar application using Electron, Vite.js, and React. The calendar will display scheduled events based on data stored in Excel files. The technologies used include React for the frontend, Electron for the desktop application, Vite.js for efficient development, and Tailwind CSS for styling.

## Dependencies

The project relies on the following key dependencies:

- **React Big Calendar:** Used for rendering a responsive and customizable calendar component.
- **Tailwind CSS:** A utility-first CSS framework for styling the user interface.

## Requirements

The primary goal is to generate a calendar for events on production machines. The events are recorded in an Excel file with the following format:

| Date de début | Heure | Durée | Récurrence en jours | Opération                          |
| ------------- | ----- | ----- | ------------------- | ---------------------------------- |
| 19/01/2024    | 10:30 | 01:30 | 7                   | Nettoyage                          |
| 16/01/2024    | 11:00 | 00:30 | 14                  | Changement outil meche de 3        |
| 17/01/2024    | 11:00 | 00:30 | 56                  | Changement outil fraise à rainurer |
| 18/01/2024    | 11:00 | 00:30 | 28                  | Graissage                          |

The application should be capable of generating schedules for multiple machines simultaneously and handling various event lists within the same Excel file.

## Usage

The application is built as a standalone executable, making it suitable for deployment on production machines without requiring specific permissions. To use the application:

1. Download the executable file.
2. Ensure that Excel files conforming to the specified format (e.g., `db/event.xlsx`) are available.
3. All Excel files present in the `db` directory are loaded and made available for display.

## Development

To contribute to the project, follow these steps:

1. Clone the project repository.
2. Install dependencies using `pnpm i`.
3. Run the development server with `pnpm run dev`.

Now you can actively contribute to the project, making enhancements or fixing issues as needed. Feel free to open pull requests to propose changes and improvements.
