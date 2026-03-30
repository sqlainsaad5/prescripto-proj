import express from 'express'
import authDoctor from '../middlewares/authDoctor.js'
import { doctorList, loginDoctor, appointmentDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile, getPatientHistory, updatePatientHealth, suggestFollowUp, startVideoConsultation, getDoctorVideoJoinDetails, endVideoConsultation } from '../controllers/doctorController.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointment', authDoctor, appointmentDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)
doctorRouter.get('/patient-history/:patientId', authDoctor, getPatientHistory)
doctorRouter.put('/patient-health/:patientId', authDoctor, updatePatientHealth)
doctorRouter.post('/suggest-follow-up', authDoctor, suggestFollowUp)
doctorRouter.post('/video/start', authDoctor, startVideoConsultation)
doctorRouter.get('/video-session/:appointmentId', authDoctor, getDoctorVideoJoinDetails)
doctorRouter.post('/video/end', authDoctor, endVideoConsultation)
export default doctorRouter