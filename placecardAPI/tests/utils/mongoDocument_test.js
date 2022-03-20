const expect = require("chai").expect;
const { ObjectId } = require("mongodb");
const { isString } = require("lodash");
const mongoDocumentFile = require("../../src/utils/mongoDocument");

describe("mongoDocument.js tests", function() {
    const validObjectId = "61aecad54d001a2e61933618";

    describe("convertIdToString function tests", () => {
        const mongoDocument = {
            _id: ObjectId(validObjectId),
            event_name: "Random Party"
        };

        it("should return an object with an _id key with a string value", () => {
            const result = mongoDocumentFile.convertIdToString(mongoDocument);
            const test = isString(result._id);
            expect(test).to.equal(true);
        });
    });

    describe("isInvalidObjectId function tests", () => {
        it("should return true if the given id is not a valid MongoDB ObjectId", () => {
            const result = mongoDocumentFile.isInvalidObjectId("1");
            expect(result).to.equal(true);
        });

        it("should return false if the given id is not a valid MongoDB ObjectId", () => {
            const result = mongoDocumentFile.isInvalidObjectId(validObjectId)
            expect(result).to.equal(false);
        });
    });
});
