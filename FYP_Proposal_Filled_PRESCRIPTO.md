# PRESCRIPTO: Smart Online Healthcare and E-Prescription System

## Final Year Project Proposal

### Submitted By
- `<Student Name 1>` — `<Registration No.>`
- `<Student Name 2>` — `<Registration No.>`
- `<Student Name 3>` — `<Registration No.>`

### Supervised By
- `<Supervisor Name>`

## Abstract
PRESCRIPTO is a full-stack web-based healthcare management system designed to digitize patient-doctor interactions and routine clinical workflows. The system provides separate portals for patients, doctors, and administrators. Patients can register, manage profiles, search doctors, book appointments, upload lab reports, make online payments, and join video consultations. Doctors can manage appointments, review patient history, update patient health notes, suggest follow-up sessions, and generate digital prescriptions. Administrators can manage doctors, monitor platform activity, and control service availability.

The proposed solution uses a modular client-server architecture with React frontends and a Node.js/Express backend connected to MongoDB. Security and reliability are handled through role-based authentication, request validation, secure file handling, and payment verification. The project aims to improve accessibility, reduce manual paperwork, and provide a practical, scalable model for digital healthcare services.

## Introduction
Healthcare services in many areas still rely on manual appointment booking, paper prescriptions, and fragmented communication between patients and doctors. These limitations create delays, data loss risks, poor follow-up management, and limited access to care for users who cannot easily visit hospitals.

PRESCRIPTO addresses these problems by providing a centralized online platform that supports appointment scheduling, secure digital records, remote consultation, and prescription management. The project is aligned with current digital transformation needs in healthcare and focuses on creating a reliable, user-friendly, and low-friction system for both service providers and patients.

## Project Motivation
The motivation for this project comes from common inefficiencies in traditional clinical workflows, including long waiting times, difficulty in maintaining patient history, and lack of structured online follow-up mechanisms. Another key motivation is the growing need for remote healthcare access through video consultation and secure online payments.

From a learning perspective, this project provides practical exposure to full-stack software engineering, secure API design, role-based access control, payment integration, cloud media handling, and production-oriented system design.

## Aims and Objectives
The main aim of this project is to design and develop a secure and scalable online healthcare platform that streamlines clinical appointment and prescription workflows.

Objectives:
- Build separate role-based modules for Patient, Doctor, and Admin users.
- Implement secure authentication and authorization for each role.
- Provide online appointment booking, cancellation, and status tracking.
- Integrate online payment processing and payment verification.
- Enable lab report upload and patient profile management.
- Develop e-prescription generation and downloadable PDF support.
- Support remote video consultation sessions for doctor-patient interaction.
- Provide dashboards for operational monitoring and decision-making.

## Scope of the Project
The scope of PRESCRIPTO includes:
- Web-based patient portal for account management, appointments, reports, payments, and consultation joining.
- Web-based doctor portal for schedule handling, patient history review, health updates, follow-up suggestion, and prescription management.
- Admin panel for doctor onboarding, availability control, and appointment oversight.
- Backend REST APIs for all business operations with validation and role checks.
- MongoDB-based data persistence for users, doctors, appointments, prescriptions, follow-ups, and reports.
- Cloud-based media storage for profile images and uploaded files.

Out of scope:
- Native Android/iOS mobile apps.
- Direct hardware integration with medical devices.
- Hospital ERP-level integration in the current phase.

## Proposed Methodology
The project follows an iterative and modular development methodology:
- Requirement analysis of patient, doctor, and admin workflows.
- System design using a three-tier architecture (frontend, backend API, database).
- Feature-wise iterative implementation (authentication, appointments, payments, consultation, prescriptions).
- Validation, integration testing, and bug fixing after each module.
- Final system testing with role-based user scenarios.

Technical approach:
- Frontend: React (Vite), Redux Toolkit, React Router, Tailwind CSS.
- Backend: Node.js, Express.js, Joi validation.
- Database: MongoDB with Mongoose.
- Security: JWT-based authentication with protected routes/middleware.
- Media: Multer + Cloudinary integration.
- Payments: Stripe checkout and verification.
- Video Consultation: Jitsi-based session flow with controlled join windows.

## Proposed Solution and Anticipated Results
The proposed solution is a centralized web platform where patients can find doctors, book appointments, pay online, join consultations, and receive digital prescriptions; doctors can manage clinical sessions and produce structured prescriptions; administrators can monitor and control core platform operations.

Anticipated results:
- Reduced manual paperwork and better record consistency.
- Faster appointment management and improved patient convenience.
- Improved access to healthcare through remote consultations.
- Better continuity of care via digital history and follow-up tracking.
- A reusable, extensible system architecture suitable for further enhancements.

## Schedule of Activities and Gantt Chart
Tentative activity plan:
- Week 1-2: Requirement analysis and proposal finalization.
- Week 3-4: Architecture and database design.
- Week 5-7: Authentication, user management, and core API setup.
- Week 8-10: Appointment and doctor/admin modules.
- Week 11-12: Payment and lab report modules.
- Week 13-14: Video consultation and e-prescription PDF modules.
- Week 15: Integration testing and bug fixing.
- Week 16: Final documentation and project presentation preparation.

Gantt chart note:
- A parallel Gantt chart can be drawn with the same activities across a 16-week timeline, showing overlap between frontend, backend, and testing/documentation tasks.

## References (APA Style)
- Fielding, R. T. (2000). Architectural styles and the design of network-based software architectures (Doctoral dissertation, University of California, Irvine).
- MongoDB, Inc. (2026). MongoDB documentation. https://www.mongodb.com/docs/
- Express.js. (2026). Express web framework documentation. https://expressjs.com/
- React Team. (2026). React documentation. https://react.dev/
- Stripe, Inc. (2026). Stripe API reference. https://docs.stripe.com/api
- Cloudinary Ltd. (2026). Cloudinary documentation. https://cloudinary.com/documentation
- Jitsi. (2026). Jitsi Meet handbook. https://jitsi.github.io/handbook/

## Template Fields You Should Replace
- Replace student names and registration numbers.
- Replace supervisor name.
- Adjust the timeline dates to match your university calendar.
- Add any supervisor-required references or methodology wording.
