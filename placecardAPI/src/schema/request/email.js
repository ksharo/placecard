const Joi = require("joi");

const emailPostBody = Joi.object({
    eventId: Joi.string().
        required(),
    guestIds: Joi.array()
                    .items(Joi.string())
                    .optional()
                    
});

module.exports = emailPostBody;
