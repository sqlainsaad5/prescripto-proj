import Joi from 'joi'
import { objectIdPattern } from '../validateRequest.js'

const objectId = Joi.string().pattern(objectIdPattern)

const doctorLoginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(1).required()
})

const doctorAppointmentActionSchema = Joi.object({
    docId: objectId.required(),
    appointmentId: objectId.required()
})

const updateDoctorProfileSchema = Joi.object({
    docId: objectId.required(),
    fee: Joi.number().positive().required(),
    address: Joi.alternatives().try(
        Joi.object({
            line1: Joi.string().allow('').optional(),
            line2: Joi.string().allow('').optional()
        }),
        Joi.string()
    ).required(),
    available: Joi.boolean().required()
})

const patientIdParamsSchema = Joi.object({
    patientId: objectId.required()
})

const updatePatientHealthSchema = Joi.object({
    docId: objectId.required(),
    allergies: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
    chronicConditions: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional()
})

const suggestFollowUpSchema = Joi.object({
    docId: objectId.required(),
    appointmentId: objectId.required(),
    slotDate: Joi.string().trim().required(),
    slotTime: Joi.string().trim().required()
})

const videoStartEndSchema = Joi.object({
    docId: objectId.required(),
    appointmentId: objectId.required()
})

const appointmentIdParamsSchema = Joi.object({
    appointmentId: objectId.required()
})

export {
    doctorLoginSchema,
    doctorAppointmentActionSchema,
    updateDoctorProfileSchema,
    patientIdParamsSchema,
    updatePatientHealthSchema,
    suggestFollowUpSchema,
    videoStartEndSchema,
    appointmentIdParamsSchema
}
