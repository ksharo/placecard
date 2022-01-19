const { isUndefined, isEmpty } = require("lodash");
const { ObjectId } = require("mongodb");
const { events } = require("../../config/mongoConfig/mongoCollections");
const { convertIdToString } = require("../utils/mongoDocument");
const {
  INVALID_EVENT_ID_MESSAGE,
  NO_EVENT_FOUND_MESSAGE,
  EVENT_UNDEFINED_MESSAGE,
  EVENT_EMPTY_MESSAGE,
  INSERT_ERROR_MESSAGE,
  UPDATE_ERROR_MESSAGE,
  DELETE_ERROR_MESSAGE,
} = require("../constants/errorMessages");
const {
  generateCRUDErrorMessage,
  generateNotFoundMessage,
} = require("../utils/errors");
const EVENT_TYPE = require("../constants/schemaTypes").SCHEMA_TYPES.EVENT;
const { validateSchema } = require("../utils/preconditions");
const { checkPrecondition } = require("../utils/preconditions");

async function getEvent(eventId) {
  checkPrecondition(eventId, isUndefined, INVALID_EVENT_ID_MESSAGE);

  const eventCollection = await events();
  const eventObjectId = ObjectId(eventId);
  const queryParameters = {
    _id: eventObjectId,
  };
  const event = await eventCollection.findOne(queryParameters);
  checkPrecondition(
    event,
    isUndefined,
    generateNotFoundMessage(NO_EVENT_FOUND_MESSAGE)
  );

  return convertIdToString(event);
}

// TODO: Maybe we should move data validation into middleware functions for POST and PUT routes rather than doing it everywhere and repeating code
// TODO: custom error handling class/objects so that we can define meaningful properties
async function createEvent(newEventConfig) {
    checkPrecondition(newEventConfig, isUndefined, EVENT_UNDEFINED_MESSAGE);
    checkPrecondition(newEventConfig, isEmpty, EVENT_EMPTY_MESSAGE);

    newEventConfig.tables = [];
    validateSchema(newEventConfig, EVENT_TYPE);

    // TODO: Validate the event time is greater than the current time
    const eventCollection = await events();
    const insertInfo = await eventCollection.insertOne(newEventConfig);

    if (insertInfo.insertedCount === 0) {
        throw new Error(generateCRUDErrorMessage(INSERT_ERROR_MESSAGE, EVENT_TYPE));
    }
    const newId = insertInfo.insertedId.toString();
    const newEvent = await this.getEvent(newId);

    return convertIdToString(newEvent);
}

async function updateEvent(eventId, updatedEventConfig) {
    checkPrecondition(eventId, isUndefined, INVALID_EVENT_ID_MESSAGE);
    checkPrecondition(updatedEventConfig, isUndefined, EVENT_UNDEFINED_MESSAGE)
    checkPrecondition(updatedEventConfig, isEmpty, EVENT_UNDEFINED_MESSAGE);
    validateSchema(updatedEventConfig, EVENT_TYPE)

    const eventCollection = await events();
    const eventObjectId = ObjectId(eventId);

    const queryParameters = {
         _id: eventObjectId
    };
    const updatedDocument = {
        $set: {
            updatedEventConfig
        }
    };

    const updateInfo = await eventCollection.updateOne(queryParameters, updatedDocument);
    if (updateInfo.matchedCount === 0 || updateInfo.modifiedCount === 0) {
        throw new Error(generateCRUDErrorMessage(UPDATE_ERROR_MESSAGE, EVENT_TYPE));
    }
    
    const updatedEvent = await this.getEvent(eventId);
    return updatedEvent;
}

async function deleteEvent(eventId) {
  checkPrecondition(eventId, isUndefined, INVALID_EVENT_ID_MESSAGE);

  const eventCollection = await events();
  const eventObjectId = ObjectId(eventId);

  const queryParameters = {
    _id: eventObjectId,
  };

  const deleteResult = await eventCollection.deleteOne(queryParameters);
  if (deleteResult.deletedCount === 0) {
    throw new Error(generateCRUDErrorMessage(DELETE_ERROR_MESSAGE, EVENT_TYPE));
  }

  return true;
}

module.exports = {
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
