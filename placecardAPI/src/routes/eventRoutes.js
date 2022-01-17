const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { events } = require("../data");
const { INVALID_EVENT_ID, EVENT_UNDEFINED_MESSAGE, EVENT_EMPTY_MESSAGE } = require('../constants/errorMessages');
const { generateErrorMessage } = require("../utils/errors");
const EventSchema = require("../data/schema/EventSchema");
const { SCHEMA_TYPES } = require("../constants/schemaTypes");
const { validateSchema } = require("../utils/schemaValidator");
const { checkPrecondition } = require("../utils/preconditions");
const statusCodes = require("../constants/statusCodes");

router.get("/:eventId", async (req, res) => {
    let eventId = req.params.eventId.trim();
    try { 
        checkPrecondition(eventId, _.isUndefined, INVALID_EVENT_ID);    
    } catch (e) {
        const error = {
            error: e.message
        };
        return res.status(statusCodes.BAD_REQUEST).json(error);
    }

    try {
        const event = await events.getEvent(eventId);
        return res.json(event);
    } catch (e) {
        const error = {
            error: generateErrorMessage(e)
        };
        return res.status(statusCodes.NOT_FOUND).json(error);
    }
});

router.post("/newEvent", async (req, res) => {
    const newEvent = req.body;
    try {
        checkPrecondition(newEvent, _.isUndefined, EVENT_UNDEFINED_MESSAGE);
        checkPrecondition(newEvent, _.isEmpty, EVENT_EMPTY_MESSAGE);
    } catch (e) {
        const error = {
            error: e.message
        };
        return res.status(statusCodes.BAD_REQUEST).json(error);
    }

    const validatorResponse = validateSchema(EventSchema, newEvent, SCHEMA_TYPES.EVENT);
    if (!_.isUndefined(validatorResponse.error)) {
        return res.status(statusCodes.BAD_REQUEST).json(validatorResponse.error);
    }
    try {
        const createdEvent = await events.createEvent(newEvent);
        return res.json(createdEvent);
    } catch(e) {
        const error = {
            error: e.message
        };
        return res.status(statusCodes.INTERNAL_SERVER).json(error);
    } 
});

module.exports = router;
