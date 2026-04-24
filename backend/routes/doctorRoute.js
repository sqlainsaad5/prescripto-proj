import express from 'express'
import authDoctor from '../middlewares/authDoctor.js'
import { doctorList, loginDoctor, appointmentDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile, getPatientHistory, updatePatientHealth, suggestFollowUp, startVideoConsultation, getDoctorVideoJoinDetails, endVideoConsultation } from '../controllers/doctorController.js'
import { validateRequest } from '../utils/validation/validateRequest.js'
import {
    doctorLoginSchema,
    doctorAppointmentActionSchema,
    updateDoctorProfileSchema,
    patientIdParamsSchema,
    updatePatientHealthSchema,
    suggestFollowUpSchema,
    videoStartEndSchema,
    appointmentIdParamsSchema
} from '../utils/validation/schemas/doctorValidation.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', validateRequest(doctorLoginSchema), loginDoctor)
doctorRouter.get('/appointment', authDoctor, appointmentDoctor)
doctorRouter.post('/complete-appointment', authDoctor, validateRequest(doctorAppointmentActionSchema), appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, validateRequest(doctorAppointmentActionSchema), appointmentCancel)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, validateRequest(updateDoctorProfileSchema), updateDoctorProfile)
doctorRouter.get('/patient-history/:patientId', authDoctor, validateRequest(patientIdParamsSchema, 'params'), getPatientHistory)
doctorRouter.put('/patient-health/:patientId', authDoctor, validateRequest(patientIdParamsSchema, 'params'), validateRequest(updatePatientHealthSchema), updatePatientHealth)
doctorRouter.post('/suggest-follow-up', authDoctor, validateRequest(suggestFollowUpSchema), suggestFollowUp)
doctorRouter.post('/video/start', authDoctor, validateRequest(videoStartEndSchema), startVideoConsultation)
doctorRouter.get('/video-session/:appointmentId', authDoctor, validateRequest(appointmentIdParamsSchema, 'params'), getDoctorVideoJoinDetails)
doctorRouter.post('/video/end', authDoctor, validateRequest(videoStartEndSchema), endVideoConsultation)
export default doctorRouter