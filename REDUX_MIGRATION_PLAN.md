# Redux Toolkit Migration Plan

This plan outlines the steps to migrate the state management of the **Prescripto** project (both Admin and Frontend) from the React Context API to Redux Toolkit (RTK). The goal is to achieve a scalable, industry-standard architecture that feels like it was designed with Redux from the beginning.

## 1. Architecture Overview

We will establish a centralized **Redux Store** for each application (`admin` and `frontend`). We will replace large Context providers with granular **Slices**, and pure helper functions will be moved to utility files, separating logic from state.

### Key Architectural Shifts
*   **State Management**: `useState` inside Context → RTK Slices (`createSlice`).
*   **Side Effects (API calls)**: `axios` in Context methods → RTK Query or `createAsyncThunk`. *We will use `createAsyncThunk` for a balance of control and familiarity with the existing axios setup.*
*   **Data Access**: `useContext` → `useSelector`.
*   **State Updates**: Context functions → `useDispatch` (dispatching actions/thunks).
*   **Helpers**: Logic like `calculateAge` inside Context → `src/utils/helpers.js` (Pure functions shouldn't be in the store).

---

## 2. Admin Application Migration (`/admin`)

### A. Dependencies
*   Install: `@reduxjs/toolkit`, `react-redux`.

### B. Structure Changes
Create `src/redux/` (or `src/store/`) with the following structure:
### Infrastructure
- [x] Create `adminSlice.js` (aToken, doctors, appointments, dashboard data).
- [x] Create `doctorSlice.js` (dToken, appointments, dashData, profile).
- [x] Create `appSlice.js` (currency, global state).
- [x] Configure Redux Store (`store.js`).
- [x] Refactor `main.jsx` (Provider setup).

### Refactoring Components/Pages
- [x] `App.jsx` (Auth logic).
- [x] `Login.jsx` (Admin/Doctor login).
- [x] `Navbar.jsx` (Logout).
- [x] `Sidebar.jsx` (Role-based navigation).
- [x] `Dashboard.jsx`.
- [x] `AllApointment.jsx`.
- [x] `AddDoctor.jsx`.
- [x] `DoctorsList.jsx`.
- [x] `DoctorDashboard.jsx`.
- [x] `DoctorAppointment.jsx`.
- [x] `DoctorProfile.jsx`.

## 3. Frontend Application Migration (`/frontend`)
### Infrastructure
- [x] Create `userSlice.js` (token, userData, auth thunks).
- [x] Create `doctorSlice.js` (public doctors list).
- [x] Create `appSlice.js` (currencySymbol).
- [x] Configure Redux Store (`store.js`).
- [x] Refactor `main.jsx` (Provider setup).

### Refactoring Components/Pages
- [x] `App.jsx` (Initial data loading).
- [x] `Navbar.jsx` (User auth).
- [x] `Home.jsx` / `TopDoctors.jsx`.
- [x] `Doctors.jsx` (Filtering).
- [x] `Appointment.jsx` (Booking logic).
- [x] `MyProfile.jsx` (Profile management).
- [x] `MyAppointments.jsx` (Listing/Cancelling).
- [x] `RelatedDoctors.jsx`.

## 4. Final Cleanup
- [x] Remove unused Context files and directories.
- [x] Verify state consistency across applications.
- [x] Final code audit and cleanup.

---

## Migration Notes
- **Thunks**: Used `createAsyncThunk` for all API calls to maintain parity with original async context functions.
- **LocalStorage**: Tokens are automatically synced with LocalStorage via slice reducers.
- **Organization**: State is separated into logical slices (Admin, Doctor, User, App) for better maintainability.

## 5. "Native Redux" Feel

To ensure the code feels native implies:
*   **No Prop Drilling**: Components access the store directly.
*   **Separation of Concerns**: API logic lives in `thunks`, not components.
*   **Immutability**: Leveraging Immer (built-in to RTK) for state updates.
*   **DevTools**: Enabling Redux DevTools for easy debugging.
