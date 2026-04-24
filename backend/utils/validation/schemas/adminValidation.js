import Joi from 'joi'
import { objectIdPattern } from '../validateRequest.js'

const objectId = Joi.string().pattern(objectIdPattern)

const adminLoginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(1).required()
})

const addDoctorSchema = Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).max(128).required(),
    speciality: Joi.string().trim().required(),
    degree: Joi.string().trim().required(),
    experience: Joi.string().trim().required(),
    about: Joi.string().trim().required(),
    fee: Joi.number().positive().required(),
    address: Joi.alternatives().try(
        Joi.object({
            line1: Joi.string().allow('').optional(),
            line2: Joi.string().allow('').optional()
        }),
        Joi.string()
    ).required()
})

const changeAvailabilitySchema = Joi.object({
    docId: objectId.required()
})

const appointmentCancelSchema = Joi.object({
    appointmentId: objectId.required()
})

export {
    adminLoginSchema,
    addDoctorSchema,
    changeAvailabilitySchema,
    appointmentCancelSchema
}
