const Joi = require("joi");

// TODO: Add properties to surveyResponseSchema, or remove it later on
const surveyResponseSchema = Joi.object({
    disliked: Joi.array().
        required(),
    liked: Joi.array().
        required(),
    ideal: Joi.array(),
        required()
});

const schema = Joi.object({
    _id: Joi.string(),
    first_name: Joi.string().
        min(2).
        required(),
    last_name: Joi.string().
        min(2).
        required(),
    email: Joi.string().
        email().
        required(),
    phone_number: Joi.string().
        required(),
    age: Joi.number().
        integer().
        required(),
    is_locked: Joi.boolean(),
    party_size: Joi.number().
        integer().
        required(),
    associated_table_number: Joi.number().
        integer(),
    children: Joi.array().
        required(),
    survey_response: surveyResponseSchema.
        required()
}).strict();

module.exports = schema;