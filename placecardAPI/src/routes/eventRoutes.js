const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { events } = require("../data");
const { EVENT_UNDEFINED, generateErrorMessage } = require('../utils/errorMessages');
const EventSchema = require("../data/schema/EventSchema");
const { SCHEMA_TYPES } = require("../utils/schemaTypes");
const { validateSchema } = require("../utils/schemaValidator");

async function eventGetRoute(req, res) {
    try {
        const event = await events.getEvent(req.params.eventId);
        return res.json(event);
    } catch (e) {
        const error = {
            errorMessage: generateErrorMessage(e)
        };
        return res.status(404).json(error);
    }
}

async function eventPostRoute(req, res) {
    const newEvent = req.body;
    if (_.isUndefined(newEvent)) {
        throw new Error(EVENT_UNDEFINED);
    }

    const validatorResponse = validateSchema(EventSchema, newEvent, SCHEMA_TYPES.EVENT);
    if (!_.isUndefined(validatorResponse.error)) {
        return res.status(400).json(validatorResponse.error);
    }
    try {
        const createdEvent = await events.createEvent(newEvent);
        return res.json(createdEvent);
    } catch(e) {
        return res.status(500).json(e);
    } 
}

router.get("/:eventId", eventGetRoute);
router.post("/:newEvent", eventPostRoute);

module.exports = router;
