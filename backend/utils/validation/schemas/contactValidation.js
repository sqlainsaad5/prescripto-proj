import Joi from 'joi'

/**
 * Letters only (Unicode), with single spaces between words. No digits or symbols.
 * Mirrors typical "Full Name" rules for contact forms.
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

export { contactUsSchema, fullNamePattern }
