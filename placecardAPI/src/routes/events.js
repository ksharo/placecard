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
const { ObjectId } = require("mongodb");

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

/* Returns all the guests for a specified event */
router.get("/guests/:eventId", async (req, res) => {
    let eventId = req.params.eventId.trim();
    try {
        const event = await events.getEvent(eventId);
        const ids = event.guest_list;
        const guests = await events.getGuests(ids);
        return res.json(guests);
    }
    catch (e) {
        return createErrorResponse(
            generateErrorMessage(e),
            ERROR_TYPES.EVENT_NOT_FOUND,
            statusCodes.NOT_FOUND,
            res
        );
    }
});

router.get("/users/:userId", async (req, res) => {
    let userId = req.params.userId.trim();
    // try {
    //     checkPrecondition(userId, _.isUndefined, INVALID_EVENT_ID_MESSAGE);
    //     checkPrecondition(userId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);
    // } catch (e) {
    //     // Create error type for INVALID USER ID later
    //     return createErrorResponse(
    //         e.message,
    //         ERROR_TYPES.INVALID_EVENT_ID,
    //         statusCodes.BAD_REQUEST,
    //         res
    //     );
    // }

    try {
        const userEvents = await events.getUserEvents(userId);
        return res.json(userEvents);
    } catch (e) {
        console.log(e);
        // Create error type for USER EVENTS NOT FOUND later
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
        console.log(e);
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INSERT_ERROR,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});

router.put("/updateEvent/:id", async (req, res) => {
    const updatedEvent = req.body;
    try {
        checkPrecondition(updatedEvent, _.isUndefined, EVENT_UNDEFINED_MESSAGE);
        checkPrecondition(updatedEvent, _.isEmpty, EVENT_EMPTY_MESSAGE);
        validateSchema(updatedEvent, SCHEMA_TYPES.EVENT);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_EVENT,
            statusCodes.BAD_REQUEST,
            res
        );
    }
    const eventId = req.params.id;
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
        const event = await events.updateEvent(eventId, updatedEvent, "PUT");
        return res.json(event);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.UPDATE_ERROR,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});

router.patch("/updateEvent/:id", async (req, res) => {
    const updatedEvent = req.body;

    try {
        checkPrecondition(updatedEvent, _.isUndefined, EVENT_UNDEFINED_MESSAGE);
        checkPrecondition(updatedEvent, _.isEmpty, EVENT_EMPTY_MESSAGE);
        validateSchema(updatedEvent, SCHEMA_TYPES.EVENTPATCH);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_EVENT,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    const eventId = req.params.id;
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
        const event = await events.updateEvent(eventId, updatedEvent, "PATCH");
        return res.json(event);
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