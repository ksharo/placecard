const Joi = require("joi");

const schema = Joi.object({
    event_name: Joi.string().required(),
    tables: Joi.array().required(),
    event_time: Joi.number().integer().greater(0).required(),
    attendees_per_table: Joi.number().integer().greater(0).max(Joi.ref("expected_number_of_attendees")).required(),
    expected_number_of_attendees: Joi.number().integer().greater(0).required()
});

module.exports = schema;