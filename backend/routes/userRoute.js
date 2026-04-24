import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentStripe, verifyStripe, contactUs, uploadLabReport, getFollowUpByToken, confirmFollowUp, getUserVideoJoinDetails } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import { validateRequest } from '../utils/validation/validateRequest.js'
import {
    registerUserSchema,
    loginUserSchema,
    updateProfileSchema,
    uploadLabReportSchema,
    bookAppointmentSchema,
    cancelAppointmentSchema,
    paymentStripeSchema,
    verifyStripeSchema,
    contactUsSchema,
    followUpByTokenQuerySchema,
    confirmFollowUpSchema,
    appointmentIdParamsSchema
} from '../utils/validation/schemas/userValidation.js'



const userRouter = express.Router()

userRouter.post('/register', validateRequest(registerUserSchema), registerUser)
userRouter.post('/login', validateRequest(loginUserSchema), loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, validateRequest(updateProfileSchema), updateProfile)
userRouter.post('/upload-lab-report', upload.single('file'), authUser, validateRequest(uploadLabReportSchema), uploadLabReport)
userRouter.post('/book-appointment', authUser, validateRequest(bookAppointmentSchema), bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, validateRequest(cancelAppointmentSchema), cancelAppointment)
userRouter.post('/payment-stripe', authUser, validateRequest(paymentStripeSchema), paymentStripe)
userRouter.post('/verifyStripe', authUser, validateRequest(verifyStripeSchema), verifyStripe)
userRouter.post('/contact-us', validateRequest(contactUsSchema), contactUs)
userRouter.get('/follow-up-by-token', validateRequest(followUpByTokenQuerySchema, 'query'), getFollowUpByToken)
userRouter.post('/confirm-follow-up', authUser, validateRequest(confirmFollowUpSchema), confirmFollowUp)
userRouter.get('/video-session/:appointmentId', authUser, validateRequest(appointmentIdParamsSchema, 'params'), getUserVideoJoinDetails)

export default userRouter