const _ = require("lodash");
const { ObjectId } = require("mongodb");
const { events } = require("../../config/mongoConfig/mongoCollections");
const mongoUtils = require("../utils/mongoDocument");
const { INVALID_EVENT_ID, NO_EVENT_FOUND, generateNotFoundMessage } = require("../utils/errorMessages");

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

// async function createEvent(eventProperties) {

// }

// async function updateEvent() {

// }

// async function deleteEvent() {

// }

module.exports = {
    getEvent
    // createEvent,
    // updateEvent,
    // deleteEvent
}