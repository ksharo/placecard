const Joi = require("joi");

/*
    Request Body: {
        "to": [list of emails],
        "eventId": eventId,
    }
*/
const emailPostBody = Joi.object({
    to: Joi.array().
        items(Joi.string()).
        min(1).
        required(),
    eventId: Joi.string().
        required()
});

module.exports = emailPostBody;