const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { guests } = require("../data");
const {
    INVALID_GUEST_ID_MESSAGE,
    GUEST_UNDEFINED_MESSAGE,
    GUEST_EMPTY_MESSAGE,
} = require("../constants/errorMessages");
const {
    generateErrorMessage,
    createErrorResponse,
} = require("../utils/errors");
const { SCHEMA_TYPES } = require("../constants/schemaTypes");
const { validateSchema } = require("../utils/schemaValidator");
const { checkPrecondition } = require("../utils/preconditions");
const statusCodes = require("../constants/statusCodes");
const ERROR_TYPES = require("../constants/errorTypes");
const { isInvalidObjectId } = require("../utils/mongoDocument");
const { INVALID_GUEST_ID } = require("../constants/errorTypes");

router.get("/:guestId", async (req, res) => {
    let guestId = req.params.guestId.trim();
    try {
        checkPrecondition(guestId, _.isUndefined, INVALID_GUEST_ID_MESSAGE);
        checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_GUEST_ID,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        const guest = await guests.getGuest(guestId);
        return res.json(guest);
    } catch (e) {
        return createErrorResponse(
            generateErrorMessage(e),
            ERROR_TYPES.GUEST_NOT_FOUND,
            statusCodes.NOT_FOUND,
            res
        );
    }
});

router.post("/newGuest", async (req, res) => {
    const newGuest = req.body;
    try {
        checkPrecondition(newGuest, _.isUndefined, GUEST_UNDEFINED_MESSAGE);
        checkPrecondition(newGuest, _.isEmpty, GUEST_EMPTY_MESSAGE);
        validateSchema(newGuest, SCHEMA_TYPES.GUEST);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_GUEST,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        const createdGuest = await guests.createGuest(newGuest);
        return res.json(createdGuest);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INSERT_ERROR,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});

module.exports = router;
