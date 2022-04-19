const { isUndefined, isEmpty } = require("lodash");
const { checkPrecondition, validateSchema } = require("../utils/preconditions");
const { guests } = require("../../config/mongoConfig/mongoCollections");
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
} = require("../utils/mongoUtils");
const { ObjectId } = require("mongodb");
const GUEST_TYPE = require("../constants/schemaTypes").SCHEMA_TYPES.GUEST;
const GUEST_TYPE_PATCH = require("../constants/schemaTypes").SCHEMA_TYPES
    .GUESTPATCH;
const {
    generateNotFoundMessage,
    generateCRUDErrorMessage,
} = require("../utils/errors");
const { INVALID_GUEST } = require("../constants/errorTypes");
const fs = require("fs");
const excelToJson = require("convert-excel-to-json");
const csvToJson = require("convert-csv-to-json");
const xlsx = require("xlsx");

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

async function updateGuest(guestId, updatedGuestConfig, updateType) {
    checkPrecondition(guestId, isUndefined, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(updatedGuestConfig, isUndefined, INVALID_GUEST);
    checkPrecondition(updatedGuestConfig, isEmpty, INVALID_GUEST);
    if (updateType === "PUT") {
        validateSchema(updatedGuestConfig, GUEST_TYPE);
    } else {
        validateSchema(updatedGuestConfig, GUEST_TYPE_PATCH);
    }

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

async function uploadSurveyData(filePath, fileType) {
    let data;

    if (fileType === "xlsx" || fileType === "xls") {
        data = excelToJson({
            sourceFile: filePath,
            header: {
                rows: 1,
            },
            columnToKey: {
                A: "name",
                B: "email_address",
                C: "company",
                D: "github_account",
            },
        });

        // Accessing JSON Object via sheet name
        let workbook = xlsx.readFile(filePath);
        let firstSheet = workbook.SheetNames[0];

        data = data[firstSheet];
    }

    if (fileType === "csv") {
        data = csvToJson.fieldDelimiter(",").getJsonFromCsv(filePath);
    }

    // Insert survey data into mongo here

    // Delete file after data is read into JSON object
    fs.unlinkSync(filePath);

    return data;
}

module.exports = {
    getGuest,
    createGuest,
    updateGuest,
    deleteGuest,
    uploadSurveyData,
};
