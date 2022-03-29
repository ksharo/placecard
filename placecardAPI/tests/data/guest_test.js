const _ = require("lodash");
const sinon = require("sinon");
const { ObjectId } = require("mongodb");
const expect = require("chai").expect;
const guestFunctions = require("../../src/data/Guest");
const mongoCollections = require("../../config/mongoConfig/mongoCollections");
const ERROR_MESSAGES = require("../../src/constants/errorMessages");
const { checkThrowError, mockGetCollection, mockUpdate} = require("../../src/utils/testingUtils");
const { generateNotFoundMessage } = require("../../src/utils/errors");

describe("data/Guest.js tests", function() {
    const validId = "61aecad54d001a2e61933620";
    const nonExistingId = "51aecad54d001a2e61933620";
    
    const validQueryParams = { _id: ObjectId(validId) };
    const opInfo = {
        insertedCount: 1,
        insertedId: validQueryParams._id,
        matchedCount: 1,
        modifiedCount: 1,
        deletedCount: 1
    };

    const nonExistingQueryParams = { _id: ObjectId(nonExistingId) };
    const errorOpInfo = {
        insertedCount: 0,
        insertedId: nonExistingQueryParams._id,
        matchedCount: 0,
        modifiedCount: 0,
        deletedCount: 0
    };

    const testGuest = {
        _id: validQueryParams._id,
        first_name: "Jane",
        last_name: "Doe",
        email: "janedoe@gmail.com",
        party_size: 5,
        survey_response: {
            disliked: [],
            liked: [],
            ideal: []
        }
    };

    const updatedGuestConfig = {
        email: "janedoe@yahoo.com",        
        party_size: 10
    };
    const updatedDocument = { $set: updatedGuestConfig };

    const newGuestConfig = _.omit(testGuest, ["_id"]);
    const failGuestConfig = {...newGuestConfig};
    failGuestConfig.first_name = "John";
    failGuestConfig.age = 30;

    let guestCollectionStub;
    let findOneStub = sinon.stub();
    let insertOneStub = sinon.stub();
    let updateOneStub = sinon.stub();
    let deleteOneStub = sinon.stub();

    beforeEach(() => {
        guestCollectionStub = sinon.stub(mongoCollections, "guests");

        findOneStub.withArgs(validQueryParams).returns(testGuest);
        findOneStub.withArgs(nonExistingQueryParams).returns(null);

        insertOneStub.withArgs(newGuestConfig).returns(opInfo);
        insertOneStub.withArgs(failGuestConfig).returns(errorOpInfo);

        updateOneStub.withArgs(validQueryParams, updatedDocument).returns(opInfo);
        updateOneStub.withArgs(nonExistingQueryParams, updatedDocument).returns(errorOpInfo);

        deleteOneStub.withArgs(validQueryParams).returns(opInfo);
        deleteOneStub.withArgs(nonExistingQueryParams).returns(errorOpInfo);

        const mockCollection = mockGetCollection({
            findOne: findOneStub,
            insertOne: insertOneStub,
            updateOne: updateOneStub,
            deleteOne: deleteOneStub
        });
        guestCollectionStub.value(mockCollection);
    });

    afterEach(() => {
        guestCollectionStub.restore();
    });

    describe("getGuest function tests", () => {
        it("should return a guest given a valid id", async () => {
            const guest = await guestFunctions.getGuest(validId);
            
            expect(guest).to.equal(testGuest);
        });

        it("should return an error if the guestId is undefined", async () => {
            const error = await checkThrowError(guestFunctions.getGuest, [undefined]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_GUEST_ID_MESSAGE);
        });

        it("should return an error if the guestId is not a valid MongoDB ObjectId", async () => {
            const error = await checkThrowError(guestFunctions.getGuest, ["1234"]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_GUEST_ID_MESSAGE);
        });

        it("should return an error if the guest could not be found", async () => {
            const error = await checkThrowError(guestFunctions.getGuest, [nonExistingId]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(generateNotFoundMessage(ERROR_MESSAGES.NO_GUEST_FOUND_MESSAGE));
        });
    });

    describe("createGuest function tests", () => {
        it("should create a guest given a valid configuration", async () => {
            const guest = await guestFunctions.createGuest(newGuestConfig);

            expect(guest).to.equal(testGuest);
        });

        it("should throw an error when guest config is undefined", async () => {
            const error = await checkThrowError(guestFunctions.createGuest, [undefined]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.be.equal(ERROR_MESSAGES.GUEST_UNDEFINED_MESSAGE);
        });

        it("should throw an error if the guest config is emptpy", async () => {
            const error = await checkThrowError(guestFunctions.createGuest, [{}]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.be.equal(ERROR_MESSAGES.GUEST_EMPTY_MESSAGE);
        });

        it("should throw an error is the guest config is missing a field", async () => {
            const missingFieldGuest = _.omit(testGuest, ["first_name"]);
            const error = await checkThrowError(guestFunctions.createGuest, [missingFieldGuest]);

            expect(error).to.not.be.undefined;
        });

    });

    describe("updateGuest function tests", async () => {
        it("should update a guest successfully given a valid guest id and input configuration", async () => {
            const updatedGuest = mockUpdate(testGuest, updatedGuestConfig);

            findOneStub.withArgs(validQueryParams).returns(updatedGuest);
            const newStubConfigs = mockGetCollection({
                findOne: findOneStub,
                updateOne: updateOneStub
            })
            guestCollectionStub.value(newStubConfigs);

            const result = await guestFunctions.updateGuest(validId, updatedGuestConfig);
            expect(result).to.equal(updatedGuest);
        });

        it("should throw an error if the guest id is undefined", async () => {
            const error = await checkThrowError(guestFunctions.updateGuest, [undefined, {}]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_GUEST_ID_MESSAGE);
        });

        it("should throw an error if te guest id is not a valid MongoDB ObjectId", async() => {
            const error = await checkThrowError(guestFunctions.updateGuest, ["1234", {}]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_GUEST_ID_MESSAGE);
        });

        it("should throw an error if the updated guest config is undefined", async () => {
            const error = await checkThrowError(guestFunctions.updateGuest, [validId, undefined]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.GUEST_UNDEFINED_MESSAGE);
        });

        it("should throw an error if the updated guest config is empty", async () => {
            const error = await checkThrowError(guestFunctions.updateGuest, [validId, {}]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.GUEST_EMPTY_MESSAGE);
        });
    });

    describe("deleteGuest function tests", async () => {
        it("should delete a guest successfully given a valid guest id", async () => {
            const result = await guestFunctions.deleteGuest(validId);

            expect(result).to.be.true;
        });

        it("should throw an error if the guest id is undefined", async () => {
            const error = await checkThrowError(guestFunctions.deleteGuest, [undefined]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_GUEST_ID_MESSAGE);
        });

        it("should throw an error if the guest id is not a valid MongoDB ObjectId", async () => {
            const error = await checkThrowError(guestFunctions.deleteGuest, ["1234"]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_GUEST_ID_MESSAGE);
        });
    });
});
