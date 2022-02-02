const Joi = require("joi");

const schema = Joi.object({
    _id: Joi.string(),
    event_name: Joi.string().
        required(),
    tables: Joi.array(),
    event_time: Joi.string().
        required(),
    location: Joi.string(),
    expected_number_of_attendees: Joi.number().
        integer().
        greater(0).
        required(),
    attendees_per_table: Joi.number().
        integer().
        greater(0).
        max(Joi.ref("expected_number_of_attendees")).
        required(),
    guest_list: Joi.array().
        required()
}).strict();

module.exports = schema;