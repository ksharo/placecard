const { ObjectId } = require("mongodb");

function convertIdToString(mongoDocument) {
    mongoDocument._id = mongoDocument._id.toString();
    return mongoDocument;
}

function isInvalidObjectId(id) {
    return !(ObjectId.isValid(id));
}


function updateFailed(updateInfo) {
    return updateInfo.matchedCount === 0 || updateInfo.modifiedCount === 0; 
}

function deleteFailed(deleteInfo) {
    return deleteInfo.deletedCount === 0;
}

function createFailed(createInfo) {
    return createInfo.insertedCount === 0;
}

module.exports = {
    convertIdToString,
    isInvalidObjectId,
    updateFailed,
    deleteFailed,
    createFailed
};
