const Joi = require("joi");

const surveyResponseSchema = Joi.object();

const schema = Joi.object({
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    age: Joi.number().required(),
    is_locked: Joi.boolean().required(),
    party_size: Joi.number().required(),
    associated_table_number: Joi.number().required(),
    children: Joi.array().required(),
    survey_response: surveyResponseSchema.required()
});

module.exports = schema;