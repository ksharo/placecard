const Joi = require("joi");

const templateData = Joi.object({
    event_name: Joi.string()
                    .min(1)
                    .required(),
    event_start_time: Joi.number()
                            .integer()
                            .required(),
    event_location: Joi.string()
                        .min(1)
                        .required(),
    guest_first_name: Joi.string()
                        .min(1).
                        required(),
    guest_last_name: Joi.string()
                        .min(1)
                        .required(),
    guest_response_url: Joi.string()
                            .required()
});

module.exports = templateData;
