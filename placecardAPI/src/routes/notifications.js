const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { checkPrecondition } = require("../utils/preconditions");
const { createErrorResponse } = require("../utils/errors");
const ERROR_TYPES = require("../constants/errorTypes");
const STATUS_CODES = require("../constants/statusCodes");
const { EMAIL_CONFIG_EMPTY, INVALID_EVENT_ID_MESSAGE, INVALID_TEMPLATE_DATA } = require("../constants/errorMessages");
const { EMAIL_SENT_SUCCESS } = require("../constants/messages");
const { sendEmailRequest, hasError } = require("../notifications/sendGridEmail");
const { createSuccessResponse } = require("../utils/apiResponse");
const { SCHEMA_TYPES } = require("../constants/schemaTypes");
const { validateSchema } = require("../utils/preconditions");
const { isInvalidObjectId } = require("../utils/mongoUtils");
const events = require("../data/Event");
const guests = require("../data/Guest");
const baseEmailConfig = require("../constants/configs");

router.use("/email",async (req, res, next) => {
    const requestBody = req.body;

    try {
        checkPrecondition(requestBody, _.isUndefined, EMAIL_CONFIG_EMPTY);
        checkPrecondition(requestBody, _.isEmpty, EMAIL_CONFIG_EMPTY);
        validateSchema(requestBody, SCHEMA_TYPES.EMAIL_POST_BODY);
        checkPrecondition(requestBody.eventId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);
    } catch (error) {
        return createErrorResponse(error.message, ERROR_TYPES.INVALID_EMAIL_CONFIG, STATUS_CODES.BAD_REQUEST, res);
    }
    next();
});

/*
    Request body: {
        eventId: <string eventId>,
        guestIds: [guestIds]
    }

    Use cases: 
        1. send email to a single guest, or only a subset of guests
        2. send email to all guests initially 
    
*/
router.post("/email", async (req, res) => {
    let { eventId, guestIds } = req.body;
    const { event_name, event_start_time, location, guest_list } = await events.getEvent(eventId);

    if (_.isUndefined(guestIds)) {
        guestIds = guest_list
    }

    // TODO: Replace with link to survey response
    const url = "https://www.google.com";
    const emailRecipients = await guests.getGuests(guestIds);

    const emailConfigs = emailRecipients.map(guest => {
        const templateData = {
            event_name,
            event_start_time,
            event_location: location,
            guest_first_name: guest.first_name,
            guest_last_name: guest.last_name,
            guest_response_url: url
        };

        console.log(baseEmailConfig);
        let newConfig = {
            ...baseEmailConfig,
            to: guest.email,
            dynamicTemplateData: templateData
        };

        try {
            validateSchema(templateData, SCHEMA_TYPES.EMAIL_TEMPLATE_DATA);
        } catch (error) {
            newConfig = {
                error: INVALID_TEMPLATE_DATA,
                values: templateData,
                guest
            };
        }

        return newConfig;
    });

    const [ invalidEmailConfigs, validEmailConfigs ] = _.partition(emailConfigs, hasError);

    // TODO: Return emails that failed to send in the response body
    try {
        const sendResponses = await Promise.allSettled(validEmailConfigs.map(config => 
            sendEmailRequest(config)
        ));
        
        return createSuccessResponse(EMAIL_SENT_SUCCESS, res);
    } catch (error) {
        return createErrorResponse(error.message, ERROR_TYPES.FAILED_EMAIL_REQUEST, STATUS_CODES.INTERNAL_SERVER, res);
    }
});

module.exports = router;
