function convertIdToString(mongoDocument) {
    mongoDocument._id = mongoDocument._id.toString();
    return mongoDocument;
}

module.exports = {
    convertIdToString
};
