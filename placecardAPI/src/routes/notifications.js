const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { checkPrecondition } = require("../utils/preconditions");
const { createErrorResponse } = require("../utils/errors");
const ERROR_TYPES = require("../constants/errorTypes");
const STATUS_CODES = require("../constants/statusCodes");
const { EMAIL_CONFIG_EMPTY, INVALID_EVENT_ID_MESSAGE } = require("../constants/errorMessages");
const { EMAIL_SENT_SUCCESS } = require("../constants/messages");
const { sendEmailRequest } = require("../notifications/sendGridEmail");
const { createSuccessResponse } = require("../utils/apiResponse");
const { SCHEMA_TYPES } = require("../constants/schemaTypes");
const { validateSchema } = require("../utils/preconditions");
const { isInvalidObjectId } = require("../utils/mongoDocument");
const events = require("../data/Event");

router.use("/email",async (req, res, next) => {
    const emailConfig = req.body;

    try {
        checkPrecondition(emailConfig, _.isUndefined, EMAIL_CONFIG_EMPTY);
        checkPrecondition(emailConfig, _.isEmpty, EMAIL_CONFIG_EMPTY);
        validateSchema(emailConfig, SCHEMA_TYPES.EMAIL_POST_BODY);
        checkPrecondition(emailConfig.eventId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);
    } catch (error) {
        return createErrorResponse(error.message, ERROR_TYPES.INVALID_EMAIL_CONFIG, STATUS_CODES.BAD_REQUEST, res);
    }
    next();
});

router.post("/email", async (req, res) => {
    let emailConfig = req.body;

    const event = await events.getEvent(emailConfig.eventId);

    emailConfig.subject = `Your invitation to "${event.event_name}"`;
    emailConfig.from = process.env.PLACECARD_EMAIL;
    let toArray = emailConfig.to;
    emailConfig.to = toArray.map(email => {
        return { email };
    });

    emailConfig.html = "<p>This is a test email for the Placecard notification system</p>";

    try {
        await sendEmailRequest(emailConfig);
        return createSuccessResponse(EMAIL_SENT_SUCCESS, res);
    } catch (error) {
        return createErrorResponse(error.message, ERROR_TYPES.FAILED_EMAIL_REQUEST, STATUS_CODES.INTERNAL_SERVER, res);
    }
});

module.exports = router;