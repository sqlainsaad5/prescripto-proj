import Joi from 'joi'

/**
 * Keep in sync with backend/utils/validation/schemas/contactValidation.js
 */
const fullNamePattern = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u

const contactUsSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(80)
    .pattern(fullNamePattern)
    .required()
    .messages({
      'string.empty': 'Full name is required.',
      'string.min': 'Full name must be at least {#limit} characters.',
      'string.max': 'Full name must be at most {#limit} characters.',
      'string.pattern.base':
        'Full name may only contain letters and spaces. Numbers and special characters are not allowed.',
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2 })
    .required()
    .messages({
      'string.empty': 'Email is required.',
      'string.email':
        'Please enter a valid email address including @ and a proper domain (e.g. name@example.com).',
    }),
  subject: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Subject is required.',
      'string.min': 'Subject must be at least {#limit} characters.',
      'string.max': 'Subject must be at most {#limit} characters.',
    }),
  message: Joi.string()
    .trim()
    .min(10)
    .max(8000)
    .required()
    .messages({
      'string.empty': 'Message is required.',
      'string.min': 'Message must be at least {#limit} characters.',
      'string.max': 'Message must be at most {#limit} characters.',
    }),
})

/**
 * @returns {{ fieldErrors: Record<string, string>, isValid: boolean }}
 */
export function validateContactForm(values) {
  const { error } = contactUsSchema.validate(values, {
    abortEarly: false,
    stripUnknown: true,
  })
  if (!error) {
    return { fieldErrors: {}, isValid: true }
  }
  const fieldErrors = {}
  for (const item of error.details) {
    const key = item.path.length ? item.path.join('.') : '_form'
    if (!fieldErrors[key]) {
      fieldErrors[key] = item.message.replace(/^"|"$/g, '')
    }
  }
  return { fieldErrors, isValid: false }
}

export { contactUsSchema, fullNamePattern }
