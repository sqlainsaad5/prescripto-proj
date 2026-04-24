import express from 'express';
import authDoctor from '../middlewares/authDoctor.js';
import authUser from '../middlewares/authUser.js';
import { createPrescription, getPrescriptionByAppointment, getPrescriptionsByPatient, downloadPrescriptionPdf } from '../controllers/prescriptionController.js';
import { validateRequest } from '../utils/validation/validateRequest.js';
import {
    createPrescriptionSchema,
    appointmentIdParamsSchema,
    patientIdParamsSchema,
    prescriptionIdParamsSchema
} from '../utils/validation/schemas/prescriptionValidation.js';

const prescriptionRouter = express.Router();

// Patient routes: /download/:id before other parameterized routes
prescriptionRouter.get('/download/:prescriptionId', authUser, validateRequest(prescriptionIdParamsSchema, 'params'), downloadPrescriptionPdf);
prescriptionRouter.get('/patient/:patientId', authUser, validateRequest(patientIdParamsSchema, 'params'), getPrescriptionsByPatient);

prescriptionRouter.post('/create', authDoctor, validateRequest(createPrescriptionSchema), createPrescription);
prescriptionRouter.get('/:appointmentId', authDoctor, validateRequest(appointmentIdParamsSchema, 'params'), getPrescriptionByAppointment);

export default prescriptionRouter;

