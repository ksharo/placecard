const sinon = require("sinon");
const _ = require("lodash");
const expect = require("chai").expect;
const { ObjectId } = require("mongodb");
const eventFunctions = require("../../src/data/Event");
const mongoCollections = require("../../config/mongoConfig/mongoCollections");
const { checkThrowError, mockGetCollection, mockUpdate } = require("../../src/utils/testingUtils");
const ERROR_MESSAGES = require("../../src/constants/errorMessages");
const { generateNotFoundMessage, generateCRUDErrorMessage } = require("../../src/utils/errors");
const { SCHEMA_TYPES } = require("../../src/constants/schemaTypes");
const { UPDATE_ERROR_MESSAGE } = require("../../src/constants/errorMessages");

describe("data/event.js tests", function() {
    const validId = "61aecad54d001a2e61933618";
    const nonExistingId = "51aecad54d001a2e61933618";
    const nonExistingObjectId = ObjectId(nonExistingId);

    const testEvent = {
        _id: ObjectId(validId),
        _userId: "abcd",
        event_name: "A Birthday Party",
        event_start_time: 1646262357,
        location: "New York, New York",
        attendees_per_table: 10,
        guest_list: [],
        surveys_sent: []
    };

    const validQueryParams = {
        _id: ObjectId(validId)
    };

    const nonValidQueryParams = {
        _id: nonExistingObjectId
    };

    const newEventConfig = _.omit(testEvent, ["_id"]);
    const opInfo = {
        insertedCount: 1,
        insertedId: testEvent._id,
        matchedCount: 1,
        modifiedCount: 1,
        deletedCount: 1
    };
    
    const newEventConfig2 = {...newEventConfig};
    newEventConfig2.event_name = "A Birthday Party 2";
    const opInfo2 = {
        insertedCount: 0,
        insertedId: nonExistingObjectId,
        matchedCount: 0,
        modifiedCount: 0,
        deletedCount: 0
    };

    const updatedEventConfig = {
        event_name: "Updated Event Name",
        event_start_time: 164627000,
        location: "Hoboken, New Jersey"
    };

    const updatedDocument = {
        $set: updatedEventConfig
    };
    
    let eventCollectionsStub;
    let findOneStub;
    let insertOneStub;
    let updateOneStub;
    let deleteOneStub;

    beforeEach(() => {
        eventCollectionsStub = sinon.stub(mongoCollections, "events");

        findOneStub = sinon.stub();
        findOneStub.withArgs(validQueryParams).returns(testEvent);
        findOneStub.withArgs(nonValidQueryParams).returns(null);

        insertOneStub = sinon.stub();
        insertOneStub.withArgs(newEventConfig).returns(opInfo);
        insertOneStub.withArgs(newEventConfig2).returns(opInfo2);

        updateOneStub = sinon.stub();
        updateOneStub.withArgs(validQueryParams, updatedDocument).returns(opInfo);
        updateOneStub.withArgs(nonValidQueryParams, updatedDocument).returns(opInfo2);

        deleteOneStub = sinon.stub();
        deleteOneStub.withArgs(validQueryParams).returns(opInfo);
        deleteOneStub.withArgs(nonValidQueryParams).returns(opInfo2);

        const stubConfigs = mockGetCollection({
            findOne: findOneStub,
            insertOne: insertOneStub,
            updateOne: updateOneStub,
            deleteOne: deleteOneStub
        });

        eventCollectionsStub.value(stubConfigs);
    });

    afterEach(() => {
        eventCollectionsStub.restore();
    });

    describe("getEvent function tests", () => {
        it("should return an event when given a valid MongoDB ObjectId", async () => {
            const event = await eventFunctions.getEvent(validId);
            expect(event).to.deep.equal(testEvent);
        });

        it("should throw an error when the eventId is undefined", async () => {
            const error = await checkThrowError(eventFunctions.getEvent, [undefined]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_EVENT_ID_MESSAGE);
        });

        it("should throw an error when eventId is an invalid object id", async () => {
            const error = await checkThrowError(eventFunctions.getEvent, ["1234"]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_EVENT_ID_MESSAGE);
        });

        it("should throw an error when the event cannot be found", async () => {
            const error = await checkThrowError(eventFunctions.getEvent, [nonExistingId]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(generateNotFoundMessage(ERROR_MESSAGES.NO_EVENT_FOUND_MESSAGE, nonExistingId));
        });
    });

    describe("createEvent function tests", () => {
        it("should successfully create an event when given a valid event configuration", async () => {
            const createdEvent = await eventFunctions.createEvent(newEventConfig);
            
            expect(createdEvent).to.deep.equal(testEvent);
        });

        it("should throww an error if the no argument (undefined) is passed in", async () => {
            const error = await checkThrowError(eventFunctions.createEvent, [undefined]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.EVENT_UNDEFINED_MESSAGE);
        });

        it("should throw an error if the event config is empty", async () => {
            const error = await checkThrowError(eventFunctions.createEvent, [{}]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.EVENT_EMPTY_MESSAGE);
        });

        it("should throw an error if the event config is not valid", async () => {
            const invalidEventConfig = _.omit(testEvent, ["_id", "event_name"]);
            const error = await checkThrowError(eventFunctions.createEvent, [invalidEventConfig]);

            expect(error).to.not.be.undefined;
        });

        it("should throw an error if the insert fails", async () => {
            const error = await checkThrowError(eventFunctions.createEvent, [newEventConfig2]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(generateCRUDErrorMessage(ERROR_MESSAGES.INSERT_ERROR_MESSAGE, SCHEMA_TYPES.EVENT));
        });
    });

    describe("updateEvent function tests", () => {
        it("should successfully update an event when provided valid parameters", async () => {
            const updatedEvent = mockUpdate(testEvent, updatedEventConfig);

            findOneStub.withArgs(validQueryParams).returns(updatedEvent)
            const newStubConfigs = mockGetCollection({
                findOne: findOneStub,
                updateOne: updateOneStub
            });

            eventCollectionsStub.value(newStubConfigs)

            const result = await eventFunctions.updateEvent(validId, updatedEventConfig);

            expect(result).to.equal(updatedEvent);
        });

        it("should throw an error if the event id is undefined", async () => {
            const error = await checkThrowError(eventFunctions.updateEvent, [undefined, updatedEventConfig]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_EVENT_ID_MESSAGE);
        });

        it("should throw an error if the event id is not a valid MongoDB ObjectId", async () => {
            const error = await checkThrowError(eventFunctions.updateEvent, ["asdf", updatedEventConfig]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_EVENT_ID_MESSAGE);
        });

        it("should throw an error if no updated event config is supplied", async () => {
            const error = await checkThrowError(eventFunctions.updateEvent, [validId]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.EVENT_UNDEFINED_MESSAGE);
        });

        it("should throw an error if the updated event config is empty", async () => {
            const error = await checkThrowError(eventFunctions.updateEvent, [validId, {}]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.EVENT_EMPTY_MESSAGE);
        });

        it("should throw an error if the update fails", async () => {
            const error = await checkThrowError(eventFunctions.updateEvent, [nonExistingId, updatedEventConfig]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(generateCRUDErrorMessage(UPDATE_ERROR_MESSAGE, SCHEMA_TYPES.EVENT));
        });
    });

    describe("deleteEvent function tests", () => {
        it("should successfully delete an event if given a valid id", async () => {
            const result = await eventFunctions.deleteEvent(validId);
            expect(result).to.be.true;
        });

        it("should throw an error if an event id is not supplied", async () => {
            const error = await checkThrowError(eventFunctions.deleteEvent, [undefined]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_EVENT_ID_MESSAGE);
        });

        it("should throw an error if the eventId is not a valid object id", async () => {
            const error = await checkThrowError(eventFunctions.deleteEvent, ["asdf"]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(ERROR_MESSAGES.INVALID_EVENT_ID_MESSAGE);
        });

        it("should throw an error if the event could not be successfully deleted", async () => {
            const error = await checkThrowError(eventFunctions.deleteEvent, [nonExistingId]);

            expect(error).to.not.be.undefined;
            expect(error.message).to.equal(generateCRUDErrorMessage(ERROR_MESSAGES.DELETE_ERROR_MESSAGE, SCHEMA_TYPES.EVENT));
        });
    });
});
