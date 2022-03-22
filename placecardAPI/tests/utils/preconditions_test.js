const expect = require("chai").expect;
const preconditions = require("../../src/utils/preconditions");
const { isUndefined, isEmpty, pick } = require("lodash");
const { SCHEMA_TYPES } = require("../../src/constants/schemaTypes");
const { checkThrowError } = require("../../src/utils/testingUtils");

describe("preconditions.js tests", function() {
    describe("checkPrecondition function tests", () => {
        const errorMessage = "test error message";

        it("should throw an error with the error message if the checkFunction returns true", async () => {
            const error = await checkThrowError(preconditions.checkPrecondition, [[], isEmpty, errorMessage]);
            expect(error.message).to.equal(errorMessage);
        });

        it("should not throw an error if the checkFunction returns false", async () => {
            const error = await checkThrowError(preconditions.checkPrecondition, ["hello", isUndefined, errorMessage]);
            expect(error).to.be.undefined;
        });
    });

    describe("validateSchema function tests", () => {
        const originalEvent = {
            _userId: "abcd",
            event_name: "Bachelor's Party",
            event_start_time: 1646262357,
            location: "Las Vegas",
            attendees_per_table: 10,
            guest_list: [],
            surveys_sent: []
        };

        it("should not return an error on success", async () => {
            const error = await checkThrowError(preconditions.validateSchema, [originalEvent, SCHEMA_TYPES.EVENT]);

            expect(error).to.be.undefined;
        });
    });
});
