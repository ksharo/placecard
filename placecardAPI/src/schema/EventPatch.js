const Joi = require("joi");

const schema = Joi.object({
    _id: Joi.string(),
    _userId: Joi.string(),
    event_name: Joi.string(),
    tables: Joi.array(),
    event_start_time: Joi.number().integer(),
    location: Joi.string(),
    attendees_per_table: Joi.number().integer().greater(0),
    guest_list: Joi.array(),
    surveys_sent: Joi.array(),
    last_viewed: Joi.number().integer()
}).strict();

module.exports = schema;
