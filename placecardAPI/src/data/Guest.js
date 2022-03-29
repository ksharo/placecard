const { isUndefined, isEmpty, isNull } = require("lodash");
const mongoCollections = require("../../config/mongoConfig/mongoCollections");
const { checkPrecondition, validateSchema } = require("../utils/preconditions");
const {
    INVALID_GUEST_ID_MESSAGE,
    GUEST_UNDEFINED_MESSAGE,
    GUEST_EMPTY_MESSAGE,
    NO_GUEST_FOUND_MESSAGE,
    INSERT_ERROR_MESSAGE,
    DELETE_ERROR_MESSAGE,
    UPDATE_ERROR_MESSAGE,
} = require("../constants/errorMessages");
const {
    convertIdToString,
    isInvalidObjectId,
    deleteFailed,
    updateFailed,
    createFailed
} = require("../utils/mongoUtils");
const { ObjectId } = require("mongodb");
const { SCHEMA_TYPES } = require("../constants/schemaTypes");
const GUEST_TYPE = SCHEMA_TYPES.GUEST;
const GUEST_TYPE_PATCH = SCHEMA_TYPES.GUEST_PATCH;
const { generateNotFoundMessage, generateCRUDErrorMessage } = require("../utils/errors");

async function getGuest(guestId) {
    checkPrecondition(guestId, isUndefined, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);

    const guestCollection = await mongoCollections.guests();
    const queryParameters = {
        _id: ObjectId(guestId),
    };
    const guest = await guestCollection.findOne(queryParameters);
    checkPrecondition(
        guest,
        isNull,
        generateNotFoundMessage(NO_GUEST_FOUND_MESSAGE)
    );

    return convertIdToString(guest);
}

async function getGuests(ids) {
    const guestCollection = await guests();
    try {
        ids = ids.map( (id) => {
            return ObjectId(id);
        });
        const matchingGuests = await guestCollection.find( { "_id" : { "$in" : ids } } );
        return matchingGuests.toArray();
    }
    catch (e) {
        throw new Error(generateCRUDErrorMessage(NO_GUEST_FOUND_MESSAGE, GUEST_TYPE));
    }
}

async function createGuest(guestConfig) {
    checkPrecondition(guestConfig, isUndefined, GUEST_UNDEFINED_MESSAGE);
    checkPrecondition(guestConfig, isEmpty, GUEST_EMPTY_MESSAGE);

    validateSchema(guestConfig, GUEST_TYPE);

    const guestCollection = await mongoCollections.guests();
    const insertInfo = await guestCollection.insertOne(guestConfig);

    if (createFailed(insertInfo)) {
        throw new Error(
            generateCRUDErrorMessage(INSERT_ERROR_MESSAGE, GUEST_TYPE)
        );
    }

    const newId = insertInfo.insertedId.toString();
    const newGuest = await this.getGuest(newId);

    return newGuest;
}

async function updateGuest(guestId, updatedGuestConfig, updateType) {
    checkPrecondition(guestId, isUndefined, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(updatedGuestConfig, isUndefined, GUEST_UNDEFINED_MESSAGE);
    checkPrecondition(updatedGuestConfig, isEmpty, GUEST_EMPTY_MESSAGE);

    if (updateType === "PUT") {
        validateSchema(updatedGuestConfig, GUEST_TYPE);
    } else {
        validateSchema(updatedGuestConfig, GUEST_TYPE_PATCH);
    }

    const guestCollection = await mongoCollections.guests();
    const guestObjectId = ObjectId(guestId);

    const queryParameters = { _id: guestObjectId };
    const updatedDocument = { $set: updatedGuestConfig };

    const updateInfo = await guestCollection.updateOne(queryParameters, updatedDocument);

    if (updateFailed(updateInfo)) {
        throw new Error(generateCRUDErrorMessage(UPDATE_ERROR_MESSAGE, GUEST_TYPE));
    }

    const updatedGuest = await this.getGuest(guestId);
    return updatedGuest;
}

async function deleteGuest(guestId) {
    checkPrecondition(guestId, isUndefined, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);

    const guestCollection = await mongoCollections.guests();
    const guestObjectId = ObjectId(guestId);
    const queryParameters = {
        _id: guestObjectId,
    };

    const deleteResult = await guestCollection.deleteOne(queryParameters);
    if (deleteFailed(deleteResult)) {
        throw new Error(generateCRUDErrorMessage(DELETE_ERROR_MESSAGE, GUEST_TYPE));
    }

    return true;
}

module.exports = {
    getGuest,
    getGuests,
    createGuest,
    updateGuest,
    deleteGuest
};
