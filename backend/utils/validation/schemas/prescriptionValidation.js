import Joi from 'joi'
import { objectIdPattern } from '../validateRequest.js'

const objectId = Joi.string().pattern(objectIdPattern)

const medicineSchema = Joi.object({
    name: Joi.string().trim().required(),
    dosage: Joi.string().trim().allow('').optional(),
    frequency: Joi.string().trim().allow('').optional(),
    duration: Joi.string().trim().allow('').optional(),
    instructions: Joi.string().trim().allow('').optional()
}).unknown(true)

const createPrescriptionSchema = Joi.object({
    docId: objectId.required(),
    appointmentId: objectId.required(),
    medicines: Joi.array().items(medicineSchema).min(1).required(),
    notes: Joi.string().allow('').optional()
})

const appointmentIdParamsSchema = Joi.object({
    appointmentId: objectId.required()
})

const patientIdParamsSchema = Joi.object({
    patientId: objectId.required()
})

const prescriptionIdParamsSchema = Joi.object({
    prescriptionId: objectId.required()
})

export {
    createPrescriptionSchema,
    appointmentIdParamsSchema,
    patientIdParamsSchema,
    prescriptionIdParamsSchema
}
