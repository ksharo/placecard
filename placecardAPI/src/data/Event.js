const _ = require("lodash");
const { ObjectId } = require("mongodb");
const { events } = require("../../config/mongoConfig/mongoCollections");
const mongoUtils = require("../utils/mongoDocument");
const { INVALID_EVENT_ID, NO_EVENT_FOUND, EVENT_UNDEFINED, generateInsertError, enerateNotFoundMessage } = require("../utils/errorMessages");
const EventSchema = require("./schema/EventSchema");
const { SCHEMA_TYPES } = require("../utils/schemaTypes")
const { validateSchema } = require("../utils/schemaValidator");

async function getEvent(eventId) {
    if (_.isUndefined(eventId)) {
        throw new Error(INVALID_EVENT_ID);
    }
    const eventObjectId = ObjectId(eventId);
    const eventCollection = await events();

    const queryParameters = {
        _id: eventObjectId
    };
    const event = await eventCollection.findOne(queryParameters);

    if (_.isUndefined(event)) {
        throw new Error(generateNotFoundMessage(NO_EVENT_FOUND, eventId));
    }
    return mongoUtils.convertIdToString(event);
}

// TODO: Maybe we should move data validation into middleware functions for POST and PUT routes rather than doing it everywhere and repeating code
async function createEvent(newEventObject) {
    if (_.isUndefined(newEventObject)) {
        throw new Error(EVENT_UNDEFINED);
    }

    newEventObject.tables = [];
    const response = validateSchema(EventSchema, newEventObject, SCHEMA_TYPES.EVENT);
    if (!_.isUndefined(response.error)) {
        throw new Error(response.error);
    }

    const eventCollection = await events();
    const insertInfo = await eventCollection.insertOne(newEventObject);

    if (insertInfo.insertedCount === 0) {
        throw new Error(generateInsertError(newEventObject));
    }
    const newId = insertInfo.insertedId.toString();
    return await this.getEvent(newId);
}

// async function updateEvent() {

// }

// async function deleteEvent() {

// }

module.exports = {
    getEvent,
    createEvent
    // updateEvent,
    // deleteEvent
}