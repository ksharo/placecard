const { isUndefined, isEmpty, isNull } = require("lodash");
const { ObjectId } = require("mongodb");
const { events } = require("../../config/mongoConfig/mongoCollections");
const mongoCollections = require("../../config/mongoConfig/mongoCollections");
const { convertIdToString, isInvalidObjectId, updateFailed, deleteFailed, createFailed } = require("../utils/mongoUtils");
const {
    INVALID_EVENT_ID_MESSAGE,
    NO_EVENT_FOUND_MESSAGE,
    EVENT_UNDEFINED_MESSAGE,
    EVENT_EMPTY_MESSAGE,
    INSERT_ERROR_MESSAGE,
    UPDATE_ERROR_MESSAGE,
    DELETE_ERROR_MESSAGE,
} = require("../constants/errorMessages");
const { generateCRUDErrorMessage, generateNotFoundMessage } = require("../utils/errors");
const { SCHEMA_TYPES } = require("../constants/schemaTypes");
const EVENT_TYPE = SCHEMA_TYPES.EVENT;
const EVENT_TYPE_PATCH = SCHEMA_TYPES.EVENT_PATCH;
const { validateSchema, checkPrecondition } = require("../utils/preconditions");
const { guests } = require("../../config/mongoConfig/mongoCollections");
const guestFns = require("./Guest");

async function getEvent(eventId) {
    checkPrecondition(eventId, isUndefined, INVALID_EVENT_ID_MESSAGE);
    checkPrecondition(eventId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);

    const eventCollection = await mongoCollections.events();
    const eventObjectId = ObjectId(eventId);
    const queryParameters = {
        _id: eventObjectId,
    };

    const event = await eventCollection.findOne(queryParameters);
    checkPrecondition(
        event,
        isNull,
        generateNotFoundMessage(NO_EVENT_FOUND_MESSAGE, eventId)
    );

    return convertIdToString(event);
}

async function getAlgorithmData(eventId) {
    checkPrecondition(eventId, isUndefined, INVALID_EVENT_ID_MESSAGE);
    checkPrecondition(eventId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);

    const eventCollection = await mongoCollections.events();
    const eventObjectId = ObjectId(eventId);
    const queryParameters = {
        _id: eventObjectId,
    };

    const event = await eventCollection.findOne(queryParameters);
    checkPrecondition(
        event,
        isNull,
        generateNotFoundMessage(NO_EVENT_FOUND_MESSAGE, eventId)
    );

    let guestList = event.guest_list;
    let algorithmData = [];
    for (let guestId of guestList) {
        let guestInfo = await guestFns.getGuest(guestId);
        let group_id = guestInfo.group_id;
        let party_size = guestInfo.party_size;
        let survey_response = guestInfo.survey_response;

        let guestAlgorithmInfo = {
            guestId: guestId,
            group_id: group_id,
            party_size: party_size,
            survey_response: survey_response,
        };

        algorithmData.push(guestAlgorithmInfo);
    }

    return algorithmData;
}

async function getUserEvents(userId) {
    // Create INVALID USER ID MESSAGE
    // checkPrecondition(userId, isUndefined, INVALID_EVENT_ID_MESSAGE);
    // checkPrecondition(userId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);

    const eventCollection = await events();
    // User id is currently a string in database, but should be objectId
    // const userObjectId = ObjectId(userId);
    const queryParameters = {
        // _userId: userObjectId,
        _userId: userId,
    };
    const userEvents = await eventCollection
        .find(queryParameters)
        .sort({ last_viewed: -1 })
        .toArray();
    // Do we need to check if events array is empty for a user?
    // checkPrecondition(
    //     userEvents,
    //     isUndefined,
    //     generateNotFoundMessage(NO_EVENT_FOUND_MESSAGE)
    // );

    return userEvents;
}

// TODO: Maybe we should move data validation into middleware functions for POST and PUT routes rather than doing it everywhere and repeating code
// TODO: custom error handling class/objects so that we can define meaningful properties
async function createEvent(newEventConfig) {
    checkPrecondition(newEventConfig, isUndefined, EVENT_UNDEFINED_MESSAGE);
    checkPrecondition(newEventConfig, isEmpty, EVENT_EMPTY_MESSAGE);
    validateSchema(newEventConfig, EVENT_TYPE);

    newEventConfig.tables = [];
    // validateSchema(newEventConfig, EVENT_TYPE, { presence: "required "});

    // TODO: Validate the event time is greater than the current time
    const eventCollection = await mongoCollections.events();
    const insertInfo = await eventCollection.insertOne(newEventConfig);

    if (createFailed(insertInfo)) {
        throw new Error(generateCRUDErrorMessage(INSERT_ERROR_MESSAGE, EVENT_TYPE));
    }
    const newId = insertInfo.insertedId.toString();
    const newEvent = await this.getEvent(newId);
    return newEvent;
}

async function addGuest(eventId, guestId, sendSurvey) {
    try {
        const event = await this.getEvent(eventId);
        const guests = [...event.guest_list];
        const surveys = event.surveys_sent ? [...event.surveys_sent] : [];
        guests.push(guestId);
        if (sendSurvey) {
            surveys.push(guestId);
        }
        const updatedConfig = { guest_list: guests, surveys_sent: surveys };
        await updateEvent(eventId, updatedConfig, "PATCH");
        return;
    } catch (e) {
        console.log(e);
        throw new Error(generateCRUDErrorMessage(UPDATE_ERROR_MESSAGE, EVENT_TYPE));
    }
}

async function updateEvent(eventId, updatedEventConfig, updateType) {
    checkPrecondition(eventId, isUndefined, INVALID_EVENT_ID_MESSAGE);
    checkPrecondition(eventId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);
    checkPrecondition(updatedEventConfig, isUndefined, EVENT_UNDEFINED_MESSAGE);
    checkPrecondition(updatedEventConfig, isEmpty, EVENT_EMPTY_MESSAGE);

    if (updateType === "PUT") {
        validateSchema(updatedEventConfig, EVENT_TYPE);
    } else {
        validateSchema(updatedEventConfig, EVENT_TYPE_PATCH);
    }

    const eventCollection = await mongoCollections.events();
    const eventObjectId = ObjectId(eventId);

    const queryParameters = { _id: eventObjectId };
    const updatedDocument = { $set: updatedEventConfig };


    const updateInfo = await eventCollection.updateOne(
        queryParameters,
        updatedDocument
    );
    if (
        updateInfo.matchedCount === 0 ||
        (updateType === "PUT" && updateInfo.modifiedCount === 0)
    ) {
        throw new Error(
            generateCRUDErrorMessage(UPDATE_ERROR_MESSAGE, EVENT_TYPE)
        );
    }
    try {
        const updatedEvent = await this.getEvent(eventId);
        return updatedEvent;
    } catch {
        const updatedEvent = await getEvent(eventId);
        return updatedEvent;
    }
}

async function getGuests(ids) {
    const guestCollection = await guests();
    try {
        ids = ids.map((id) => {
            return ObjectId(id);
        });
        const matchingGuests = await guestCollection.find({
            _id: { $in: ids },
        });
        return matchingGuests.toArray();
    } catch (e) {
        throw new Error(
            generateCRUDErrorMessage(UPDATE_ERROR_MESSAGE, EVENT_TYPE)
        );
    }
}

async function deleteEvent(eventId) {
    checkPrecondition(eventId, isUndefined, INVALID_EVENT_ID_MESSAGE);
    checkPrecondition(eventId, isInvalidObjectId, INVALID_EVENT_ID_MESSAGE);

    const eventCollection = await mongoCollections.events();
    const eventObjectId = ObjectId(eventId);

    const queryParameters = {
        _id: eventObjectId,
    };

    const deleteResult = await eventCollection.deleteOne(queryParameters);
    if (deleteFailed(deleteResult)) {
        throw new Error(generateCRUDErrorMessage(DELETE_ERROR_MESSAGE, EVENT_TYPE));
    }

    return true;
}

module.exports = {
    getAlgorithmData,
    getEvent,
    getUserEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getGuests,
    addGuest,
};