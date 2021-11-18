const Joi = require("joi");

const surveyResponseSchema = Joi.object();

const schema = Joi.object({
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    age: Joi.number().integer().required(),
    is_locked: Joi.boolean(),
    party_size: Joi.number().integer().required(),
    associated_table_number: Joi.number().integer(),
    children: Joi.array().required(),
    survey_response: surveyResponseSchema.required()
});

module.exports = schema;