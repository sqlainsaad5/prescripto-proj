# Prescripto: Advanced Healthcare Management Platform
## Functional Requirements & System Architecture Document

### 1. Project Overview
**Prescripto** is an end-to-end healthcare management ecosystem designed to bridge the gap between patients and doctors. Beyond simple appointment booking, the platform aims to provide a secure, scalable, and clinical-grade environment for managing the entire patient care lifecycle.

---

### 2. User Roles & Access Control

#### A. Patient (User)
- **Profile Management**: Personal details, medical history uploads, and profile picture.
- **Doctor Discovery**: Search and filter doctors by speciality, experience, and availability.
- **Appointment Lifecycle**: Book, pay for, track history, and cancel appointments.
- **Patient Dashboard**: View upcoming appointments, download prescriptions, and manage billing.

#### B. Medical Practitioner (Doctor)
- **Clinical Dashboard**: Overview of appointments, total earnings, and patient statistics.
- **Scheduling**: Dynamic management of time slots and availability.
- **Care Management**: Issue digital prescriptions, view patient history, and mark consultations as complete.
- **Profile Controls**: Manage professional bio, fees, and clinic addresses.

#### C. System Administrator (Admin)
- **Doctor Onboarding**: Verify and add new medical professionals to the platform.
- **Global Overview**: Monitor all appointments, payments, and system health.
- **Analytics**: Business intelligence on platform growth and speciality demands.

---

### 3. Functional Requirements (Phase 1 & 2)

#### 3.1. Core Booking Engine (Existing + Optimized)
- **Atomic Booking**: Use DB transactions to ensure seat allocation and doctor availability updates happen simultaneously.
- **Stripe Integration**: Secure payment processing with automated status updates.
- **Conflict Resolution**: Preventing double-booking of the same time slot across different users.

#### 3.2. Digital Prescription System (New)
- **Prescription Builder**: Multi-field form for doctors to prescribe medication (Name, Dosage, Frequency, Duration).
- **PDF Generation**: Automated creation of official digital prescriptions with doctor's digital signature/seal.
- **Direct Delivery**: Prescriptions automatically shared with patients upon appointment completion.

#### 3.3. Electronic Health Records (EHR) (New)
- **Medical Vault**: Secure storage for patient-uploaded lab reports and previous diagnosis records.
- **History Timeline**: Chronological view of all past consultations for a single patient, accessible to the attending doctor.

#### 3.4. Patient Engagement (New)
- **Verified Reviews**: Star-ratings and text reviews restricted to patients who have completed consultations.
- **Automated Notifications**: Email/SMS reminders for upcoming appointments and medication schedules.

---

### 4. Non-Functional & Technical Requirements

#### 4.1. Production-Grade Architecture
- **Layered Design**: Separation of concerns into Controllers (HTTP), Services (Business Logic), and Repositories (Data Access).
- **Global Error Handling**: Standardized error response middleware using custom Exception classes.
- **Input Validation**: Strict schema enforcement using Zod/Joi to prevent malformed data.

#### 4.2. Security Requirements
- **Rate Limiting**: Protection against brute-force attacks on Auth and Contact endpoints.
- **Data Privacy**: Encryption of sensitive user data and secure JWT-based authentication.
- **CORS & Headers**: Strict CORS configuration and `helmet` for HTTP header security.

#### 4.3. Scalability & Performance
- **Caching**: Implement Redis for frequently accessed static data (e.g., Doctor lists).
- **Lean Queries**: Optimize MongoDB queries using indexes and lean objects to reduce memory overhead.
- **File Management**: High-performance image and PDF storage using Cloudinary.

---

### 5. Proposed Technical Stack
- **Frontend**: React.js (Vite), Redux Toolkit (State Management), Tailwind CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **External Services**: 
    - **Stripe**: Payments.
    - **Cloudinary**: Medical documents & Images.
    - **Nodemailer**: Communication.
- **Testing**: Jest & Supertest.

---

### 6. Expected Database Enhancements (Proposed)

| Model | Key Additions | Purpose |
| :--- | :--- | :--- |
| **Doctor** | `averageRating`, `totalReviews` | Reputation management. |
| **User** | `healthHistory: [FileUrl]` | Secure EHR storage. |
| **Prescription** | `appointmentId`, `medicines: [{}]`, `notes` | Digital medical records. |
| **Review** | `userId`, `docId`, `rating`, `comment` | Social proof and quality control. |

---

### 7. Implementation Roadmap
1. **Refactor Infrastructure**: Implement Service Layer and Global Error Handling.
2. **Clinical Expansion**: Build Prescription and EHR modules.
3. **Engagement Features**: Implement Reviews, Ratings, and Notifications.
4. **Platform Hardening**: Add Rate Limiting, Caching, and Unit Testing.
