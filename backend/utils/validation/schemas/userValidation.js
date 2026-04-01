import Joi from 'joi'
import { objectIdPattern } from '../validateRequest.js'

const objectId = Joi.string().pattern(objectIdPattern)

const registerUserSchema = Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).max(128).required()
})

const loginUserSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(1).required()
})

const updateProfileSchema = Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    phone: Joi.string().trim().min(7).max(20).required(),
    address: Joi.alternatives().try(
        Joi.object({
            line1: Joi.string().allow('').optional(),
            line2: Joi.string().allow('').optional()
        }),
        Joi.string()
    ).optional(),
    dob: Joi.string().trim().required(),
    gender: Joi.string().trim().required()
})

const uploadLabReportSchema = Joi.object({
    appointmentId: objectId.required(),
    type: Joi.string().valid('xray', 'blood_test', 'diagnostic').required()
})

const bookAppointmentSchema = Joi.object({
    docId: objectId.required(),
    slotDate: Joi.string().trim().required(),
    slotTime: Joi.string().trim().required(),
    consultationMode: Joi.string().valid('video', 'in_person').optional()
})

const cancelAppointmentSchema = Joi.object({
    appointmentId: objectId.required()
})

const paymentStripeSchema = Joi.object({
    appointmentId: objectId.required()
})

const verifyStripeSchema = Joi.object({
    appointmentId: objectId.required(),
    success: Joi.string().valid('true', 'false').required(),
    session_id: Joi.string().trim().required()
})

const contactUsSchema = Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    email: Joi.string().trim().lowercase().email().required(),
    subject: Joi.string().trim().min(2).max(200).required(),
    message: Joi.string().trim().min(2).required()
})

const followUpByTokenQuerySchema = Joi.object({
    token: Joi.string().trim().required()
})

const confirmFollowUpSchema = Joi.object({
    token: Joi.string().trim().required()
})

const appointmentIdParamsSchema = Joi.object({
    appointmentId: objectId.required()
})

export {
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
}
