import Joi from 'joi';

const reportSchema = Joi.object({
    text: Joi.string().min(10).max(500).required().messages({
        'string.base': `"text" should be a type of 'text'`,
        'string.empty': `"text" cannot be an empty field`,
        'string.min': `"text" should have a minimum length of {#limit}`,
        'any.required': `"text" is a required field`
    }),
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
});

// 2. Create the middleware function.
export const validateReport = (req, res, next) => {
    // 3. Validate the request body against our schema.
    const { error } = reportSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};