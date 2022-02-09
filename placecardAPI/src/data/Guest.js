const { isUndefined, isEmpty } = require("lodash");
const { guests, events } = require("../../config/mongoConfig/mongoCollections");
const { checkPrecondition, validateSchema } = require("../utils/preconditions");
const {
    INVALID_GUEST_ID_MESSAGE,
    GUEST_EMPTY_MESSAGE,
    NO_GUEST_FOUND_MESSAGE,
    INSERT_ERROR_MESSAGE,
    DELETE_ERROR_MESSAGE,
    UPDATE_ERROR_MESSAGE,
} = require("../constants/errorMessages");
const {
    convertIdToString,
    isInvalidObjectId,
} = require("../utils/mongoDocument");
const { ObjectId } = require("mongodb");
const GUEST_TYPE = require("../constants/schemaTypes").SCHEMA_TYPES.GUEST;
const {
    generateNotFoundMessage,
    generateCRUDErrorMessage,
} = require("../utils/errors");
const { INVALID_GUEST } = require("../constants/errorTypes");

async function getGuest(guestId) {
    checkPrecondition(guestId, isUndefined, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);

    const guestCollection = await guests();
    const queryParameters = {
        _id: ObjectId(guestId),
    };
    const guest = await guestCollection.findOne(queryParameters);
    checkPrecondition(
        guest,
        isUndefined,
        generateNotFoundMessage(NO_GUEST_FOUND_MESSAGE)
    );

    return convertIdToString(guest);
}

async function createGuest(guestConfig) {
    checkPrecondition(guestConfig, isUndefined, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(guestConfig, isEmpty, GUEST_EMPTY_MESSAGE);

    validateSchema(guestConfig, GUEST_TYPE);

    const guestCollection = await guests();
    const insertInfo = await guestCollection.insertOne(guestConfig);

    if (insertInfo.insertedCount === 0) {
        throw new Error(
            generateCRUDErrorMessage(INSERT_ERROR_MESSAGE, GUEST_TYPE)
        );
    }

    const newId = insertInfo.insertedId.toString();
    const newGuest = await this.getGuest(newId);

    return newGuest;
}

async function updateGuest(guestId, updatedGuestConfig) {
    checkPrecondition(guestId, isUndefined, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(updatedGuestConfig, isUndefined, INVALID_GUEST);
    checkPrecondition(updatedGuestConfig, isEmpty, INVALID_GUEST);
    validateSchema(updatedGuestConfig, GUEST_TYPE);

    const guestCollection = await guests();
    const guestObjectId = ObjectId(guestId);

    const queryParameters = {
        _id: guestObjectId,
    };
    const updatedDocument = {
        $set: updatedGuestConfig,
    };
    const updateInfo = await guestCollection.updateOne(
        queryParameters,
        updatedDocument
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
        throw new Error(
            generateCRUDErrorMessage(UPDATE_ERROR_MESSAGE, GUEST_TYPE)
        );
    }

    const updatedGuest = await this.getGuest(guestId);
    return updatedGuest;
}

async function deleteGuest(guestId) {
    checkPrecondition(guestId, isUndefined, INVALID_GUEST_ID_MESSAGE);

    const guestCollection = await guests();
    const guestObjectId = ObjectId(guestId);
    const queryParameters = {
        _id: guestObjectId,
    };

    const deleteResult = await guestCollection.deleteOne(queryParameters);
    if (deleteResult.deletedCount === 0) {
        throw new Error(
            generateCRUDErrorMessage(DELETE_ERROR_MESSAGE, GUEST_TYPE)
        );
    }

    return true;
}

module.exports = {
    getGuest,
    createGuest,
    updateGuest,
    deleteGuest,
};
