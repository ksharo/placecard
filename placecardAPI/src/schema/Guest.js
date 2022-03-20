const Joi = require("joi");

// TODO: Add properties to surveyResponseSchema, or remove it later on
const surveyResponseSchema = Joi.object({
    disliked: Joi.array().required(),
    liked: Joi.array().required(),
    ideal: Joi.array().required(),
});

const schema = Joi.object({
    _id: Joi.string(),
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string(),
    // Only one is required between email/phone
    email: Joi.string().email().required(),
    // phone_number: Joi.string(),
    party_size: Joi.number().integer().required(),
    associated_table_number: Joi.number().integer(),
    group_id: Joi.string(),
    group_name: Joi.string(),
    survey_response: surveyResponseSchema.required(),
}).strict();

module.exports = schema;
