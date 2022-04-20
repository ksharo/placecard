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
const { SCHEMA_TYPES } = require("../constants/schemaTypes");

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
        ids = ids.map((id) => {
            return ObjectId(id);
        });
        const matchingGuests = await guestCollection.find({ "_id": { "$in": ids } });
        return matchingGuests.toArray();
    } catch (e) {
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

async function uploadSurveyData(filePath, fileType) {
    let data;

    if (fileType === "xlsx" || fileType === "xls") {
        data = excelToJson({
            sourceFile: filePath,
            header: {
                rows: 1,
            },
            columnToKey: {
                A: "Name",
                B: "Contact",
                // C: "company",
                // D: "github_account",
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

    // Loop through each row and group together people with the same contact
    /*
        For a group:
        {
            groupname: "caleb,chloe,abby group",
            contact: cchoy@stevens.edu,
            members: [caleb, chloe, abby]
        }

        For an individual:
        {
            groupname: "Jayson Infante",
            contact: jinfante@stevens.edu,
            members: [Jayson Infante]
        }
    */
    let emails = {};
    for (let person of data) {
        let email = person["Contact"];
        let name = person["Name"];
        if (email in emails) {
            let members = emails[email];
            members.push(name);
        } else {
            let newArr = [];
            newArr.push(name);
            emails[email] = newArr;
        }
    }

    /*
        We now have this data format.

        {
        'jayson.infante708@gmail.com': [
            'Jayson Infante',
            'Janelle Infante',
            'Joel Infante',
            'Joan Infante'
        ],
        'cchoy@stevens.edu': [ 'Caleb Choy' ],
        'ksharo@stevens.edu': [ 'Kaitlyn Sharo' ],
        'tjtayo@gmail.com': [ 'Thad Tayo', 'Damien Tayo', 'Dion Tayo' ],
        'gaustria@stevens.edu': [ 'Gil Austria' ]
        }        

    */
    let returnData = [];
    for (const [email, members] of Object.entries(emails)) {
        if (members.length > 1) {
            let groupname = members.join(",");
            groupname = groupname + " group";
            returnData.push({
                groupname: groupname,
                contact: email,
                members: members,
            });
        } else {
            returnData.push({
                groupname: members[0],
                contact: email,
                members: members,
            });
        }
    }

    // Insert survey data into mongo here

    // Delete file after data is read into JSON object
    fs.unlinkSync(filePath);

    // return data;
    return returnData;
}

module.exports = {
    getGuest,
    getGuests,
    createGuest,
    updateGuest,
    deleteGuest,
    uploadSurveyData,
};