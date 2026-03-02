import express from 'express';
import authDoctor from '../middlewares/authDoctor.js';
import authUser from '../middlewares/authUser.js';
import { createPrescription, getPrescriptionByAppointment, getPrescriptionsByPatient, downloadPrescriptionPdf } from '../controllers/prescriptionController.js';

const prescriptionRouter = express.Router();

// Patient routes: /download/:id before other parameterized routes
prescriptionRouter.get('/download/:prescriptionId', authUser, downloadPrescriptionPdf);
prescriptionRouter.get('/patient/:patientId', authUser, getPrescriptionsByPatient);

prescriptionRouter.post('/create', authDoctor, createPrescription);
prescriptionRouter.get('/:appointmentId', authDoctor, getPrescriptionByAppointment);

export default prescriptionRouter;

