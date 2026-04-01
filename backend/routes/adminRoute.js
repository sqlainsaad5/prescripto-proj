import express from 'express'
import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'
import { validateRequest } from '../utils/validation/validateRequest.js'
import {
    adminLoginSchema,
    addDoctorSchema,
    changeAvailabilitySchema,
    appointmentCancelSchema
} from '../utils/validation/schemas/adminValidation.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), validateRequest(addDoctorSchema), addDoctor)
adminRouter.post('/login', validateRequest(adminLoginSchema), loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, validateRequest(changeAvailabilitySchema), changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/appointment-cancel', authAdmin, validateRequest(appointmentCancelSchema), appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter