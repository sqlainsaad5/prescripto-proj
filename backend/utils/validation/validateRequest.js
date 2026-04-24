const objectIdPattern = /^[0-9a-fA-F]{24}$/

const validateRequest = (schema, source = 'body') => {
    return (req, res, next) => {
        const input = req[source] || {}
        const { value, error } = schema.validate(input, {
            abortEarly: false,
            stripUnknown: true
        })

        if (error) {
            const details = error.details.map((item) =>
                item.message.replace(/^"|"$/g, '')
            )
            const fieldErrors = {}
            for (const item of error.details) {
                const key = item.path.length ? item.path.join('.') : '_form'
                if (!fieldErrors[key]) {
                    fieldErrors[key] = item.message.replace(/^"|"$/g, '')
                }
            }
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: details,
                fieldErrors,
            })
        }

        req[source] = value
        next()
    }
}

export { validateRequest, objectIdPattern }
