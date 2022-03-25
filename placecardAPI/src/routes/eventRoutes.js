const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { events } = require("../data");
const {
    INVALID_EVENT_ID_MESSAGE,
    EVENT_UNDEFINED_MESSAGE,
    EVENT_EMPTY_MESSAGE,
} = require("../constants/errorMessages");
const {
    generateErrorMessage,
    createErrorResponse,
} = require("../utils/errors");
const { SCHEMA_TYPES } = require("../constants/schemaTypes");
const { validateSchema } = require("../utils/preconditions");
const { checkPrecondition } = require("../utils/preconditions");
const statusCodes = require("../constants/statusCodes");
const ERROR_TYPES = require("../constants/errorTypes");
const { isInvalidObjectId } = require("../utils/mongoDocument");
const { INVALID_EVENT_ID } = require("../constants/errorTypes");
const axios = require("axios");

router.get("/algorithm/:eventId", async (req, res) => {
    // eventId
    // get all the guests from that eventId
    // from there, get guestId, groupId, groupSize, surveyResults

    let eventId = req.params.eventId.trim();
    try {
        checkPrecondition(eventId, _.isUndefined, INVALID_EVENT_ID_MESSAGE);
        checkPrecondition(eventId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_EVENT_ID,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        let event = await events.getEvent(eventId);
    } catch (e) {
        return createErrorResponse(
            generateErrorMessage(e),
            ERROR_TYPES.EVENT_NOT_FOUND,
            statusCodes.NOT_FOUND,
            res
        );
    }

    try {
        let algorithmData = await events.getAlgorithmData(eventId);

        let { data } = await axios.post("http://127.0.0.1:5000/flask", {
            algorithmData: algorithmData,
        });
        res.status(200).json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});

router.get("/:eventId", async (req, res) => {
    let eventId = req.params.eventId.trim();
    try {
        checkPrecondition(eventId, _.isUndefined, INVALID_EVENT_ID_MESSAGE);
        checkPrecondition(eventId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_EVENT_ID,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        const event = await events.getEvent(eventId);
        return res.json(event);
    } catch (e) {
        return createErrorResponse(
            generateErrorMessage(e),
            ERROR_TYPES.EVENT_NOT_FOUND,
            statusCodes.NOT_FOUND,
            res
        );
    }
});

router.post("/newEvent", async (req, res) => {
    const newEvent = req.body;
    try {
        checkPrecondition(newEvent, _.isUndefined, EVENT_UNDEFINED_MESSAGE);
        checkPrecondition(newEvent, _.isEmpty, EVENT_EMPTY_MESSAGE);
        validateSchema(newEvent, SCHEMA_TYPES.EVENT);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_EVENT,
            statusCodes.BAD_REQUEST,
            res
        );
    }
    try {
        const createdEvent = await events.createEvent(newEvent);
        return res.json(createdEvent);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INSERT_ERROR,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});

router.put("/updateEvent", async (req, res) => {
    const oldEvent = req.body;

    try {
        checkPrecondition(oldEvent, _.isUndefined, EVENT_UNDEFINED_MESSAGE);
        checkPrecondition(oldEvent, _.isEmpty, EVENT_EMPTY_MESSAGE);
        validateSchema(oldEvent, SCHEMA_TYPES.EVENT);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_EVENT,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    const eventId = oldEvent._id;
    try {
        checkPrecondition(eventId, _.isUndefined, INVALID_EVENT_ID);
        checkPrecondition(eventId, isInvalidObjectId, INVALID_EVENT_ID);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_EVENT_ID,
            INVALID_EVENT_ID,
            res
        );
    }

    try {
        const updatedEvent = await events.updateEvent(eventId, oldEvent);
        return res.json(updatedEvent);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.UPDATE_ERROR,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});

router.delete("/:eventId", async (req, res) => {
    const eventId = req.params.eventId.trim();
    try {
        checkPrecondition(eventId, _.isUndefined, INVALID_EVENT_ID_MESSAGE);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_EVENT_ID,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        const event = await events.getEvent(eventId);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.EVENT_NOT_FOUND,
            statusCodes.NOT_FOUND,
            res
        );
    }

    try {
        await events.deleteEvent(eventId);
        const response = {
            snapshot_id: eventId,
        };
        return res.json(response);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.EVENT_NOT_FOUND,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});

module.exports = router;
