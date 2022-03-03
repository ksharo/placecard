const expect = require("chai").expect;
const preconditions = require("../../src/utils/preconditions");
const { isUndefined, isEmpty, pick } = require("lodash");
const { MISSING_FUNCTION_ARGUMENT_MESSAGE } = require("../../src/constants/errorMessages");
const { SCHEMA_TYPES } = require("../../src/constants/schemaTypes");
const { checkThrowError } = require("../../src/utils/testingUtils");

describe("preconditions.js tests", function() {
    describe("checkPrecondition function tests", () => {
        const errorMessage = "test error message";

        it("should throw an error for missing function arguments", () => {
            const error = checkThrowError(preconditions.checkPrecondition, [""]);
            expect(error.message).to.equal(MISSING_FUNCTION_ARGUMENT_MESSAGE);
        });

        it("should throw an error with the error message if the checkFunction returns true", () => {
            const error = checkThrowError(preconditions.checkPrecondition, [[], isEmpty, errorMessage]);
            expect(error.message).to.equal(errorMessage);
        });

        it("should not throw an error if the checkFunction returns false", () => {
            const error = checkThrowError(preconditions.checkPrecondition, ["hello", isUndefined, errorMessage]);
            expect(error).to.be.undefined;
        });
    });

    describe("validateSchema function tests", () => {
        const originalEvent = {
            event_name: "Bachelor's Party",
            event_start_time: 1646262357,
            event_end_time: 1646362357,
            location: "Las Vegas",
            expected_number_of_attendees: 100,
            attendees_per_table: 10,
            guest_list: []
        };

        it("should not return an error on success", () => {
            const error = checkThrowError(preconditions.validateSchema, [originalEvent, SCHEMA_TYPES.EVENT]);

            expect(error).to.be.undefined;
        });

        it("should return an error when there is a missing field(s)", () => {
            const event = pick(originalEvent, ["event_name", "event_start_time", "event_end_time"]);
            const error = checkThrowError(preconditions.validateSchema, [event, SCHEMA_TYPES.EVENT]);

            expect(error).to.not.be.undefined;
        });
    });
});
