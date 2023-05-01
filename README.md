# Hospital Management System

This web application is designed to manage patient information and appointments for a hospital. The system allows for patient registration, appointment scheduling, diagnostic tests and treatments recording, and doctor management.

## Features:

* Patient registration and discharge: New patients can be registered and discharged through the system. The system assigns a room for admitted patients based on availability, and room occupancy is updated for discharged patients.

* Doctor appointment and test scheduling: Appointments for doctors are scheduled based on availability and priority. The system notifies doctors about their appointments through a dashboard. Doctors can also schedule tests and treatments for patients.

* Patient health data recording: All the health information of a patient, including test results and treatments administered, is recorded.

* Doctor dashboard: The system displays the records of all the patients treated by a doctor on a dashboard. Doctors can also query patient information and record drugs/treatments prescribed.

* User management: Database administrators can add/delete users to the system. A data security policy with suitable access control is implemented.

## Technology Stack:

* Front-end: HTML, CSS, JavaScript, and ReactJS

* Back-end: Node.js, Express.js, mysql2, and cors middleware

* Database: MySQL

* Operating Systems: Windows and Linux

## Installation:

* Clone the repository to your local machine.
* Open a terminal and navigate to the project directory.
* Install the required dependencies for the backend using the command `npm i`.
* Start the backend server using the command `node app.js`.
* Open another terminal and navigate to the frontend directory.
* Install the required dependencies for the frontend using the command `npm i`.
* Start the frontend server using the command `npm start`.
* Open your web browser and go to `http://localhost:3000/` to access the hospital management system web application.

Note: Make sure that you have Node.js and MySQL installed on your machine before running the application. Also, you may need to modify the database connection settings appropriately to match your local database configuration.

Thank you for using our application!