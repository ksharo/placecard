const expect = require("chai").expect;
const { ObjectId } = require("mongodb");
const { isString } = require("lodash");
const mongoDocumentFile = require("../../src/utils/mongoUtils");

describe("mongoUtils.js tests", function() {
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

    describe("updatedFailed function tests", () => {
        it("should return false if both matchedCount and modifiedCount are not equal to 0", () => {
            const successUpdateInfo = {
                matchedCount: 1,
                modifiedCount: 1
            };
            const result = mongoDocumentFile.updateFailed(successUpdateInfo);
            expect(result).to.be.false;
        });

        it("should return true if matchedCount is equal to 0", () => {
            const failUpdateInfo = {
                matchedCount: 0
            };
            const result = mongoDocumentFile.updateFailed(failUpdateInfo);
            expect(result).to.be.true;
        });

        it("should return true if modifiedCount is equal to 0", () => {
            const updateInfo = {
                modifiedCount: 0
            };
            const result = mongoDocumentFile.updateFailed(updateInfo);
            expect(result).to.be.true;
        });
    });

    describe("deleteFailed function tests", () => {
        it("should return false if deletedCount does not equal 0", () => {
            const deleteInfo = {
                deletedCount: 1
            };
            const result = mongoDocumentFile.deleteFailed(deleteInfo);
            expect(result).to.be.false;
        });

        it("should return true if deletedCount is equal to 0", () => {
            const deleteInfo = {
                deletedCount: 0
            };
            const result = mongoDocumentFile.deleteFailed(deleteInfo);
            expect(result).to.be.true;
        });
    });

    describe("createFailed function tests", () => {
        it("should return false if insertedCount is not equal to 0", () => {
            const insertInfo = {
                insertedCount: 1
            };

            const result = mongoDocumentFile.createFailed(insertInfo);
            expect(result).to.be.false;
        });

        it("should return true if insertedCount is equal to 0", () => {
            const insertInfo = {
                insertedCount: 0
            };

            const result = mongoDocumentFile.createFailed(insertInfo);
            expect(result).to.be.true;
        });
    });
});
