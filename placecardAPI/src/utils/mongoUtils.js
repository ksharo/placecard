const { ObjectId } = require("mongodb");

function convertIdToString(mongoDocument) {
    mongoDocument._id = mongoDocument._id.toString();
    return mongoDocument;
}

function isInvalidObjectId(id) {
    return !(ObjectId.isValid(id));
}

module.exports = {
    convertIdToString,
    isInvalidObjectId
};
