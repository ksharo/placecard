const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { checkPrecondition } = require("../utils/preconditions");
const { createErrorResponse } = require("../utils/errors");
const ERROR_TYPES = require("../constants/errorTypes");
const STATUS_CODES = require("../constants/statusCodes");
const { EMAIL_CONFIG_EMPTY, EMAIL_CONFIG_MISSING_PROP } = require("../constants/errorMessages");
const { EMAIL_SENT_SUCCESS } = require("../constants/messages");
const { sendEmailRequest } = require("../notifications/sendGridEmail");
const { createSuccessResponse } = require("../utils/apiResponse");

router.post("/email", async (req, res) => {
    const emailConfig = req.body;
    emailConfig.from = process.env.PLACECARD_EMAIL;

    try {
        checkPrecondition(emailConfig, _.isUndefined, EMAIL_CONFIG_EMPTY);
        checkPrecondition(emailConfig, _.isEmpty, EMAIL_CONFIG_EMPTY);
        checkPrecondition(emailConfig.to, _.isUndefined, EMAIL_CONFIG_MISSING_PROP);
    } catch (error) {
        return createErrorResponse(e.message, ERROR_TYPES.INVALID_EMAIL_CONFIG, STATUS_CODES.BAD_REQUEST, res);
    }

    try {
        await sendEmailRequest(emailConfig);
        return createSuccessResponse(EMAIL_SENT_SUCCESS, res);
    } catch (error) {
        console.log("Error in routes: ", error  );
        return createErrorResponse(error.message, ERROR_TYPES.FAILED_EMAIL_REQUEST, STATUS_CODES.INTERNAL_SERVER, res);
    }
});

module.exports = router;