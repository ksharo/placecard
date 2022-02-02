const expect = require("chai").expect;
const preconditions = require("../../src/utils/preconditions");
const { isUndefined } = require("lodash");
const { MISSING_FUNCTION_ARGUMENT_MESSAGE } = require("../../src/constants/errorMessages");

describe("preconditions.js tests", function() {
    describe("checkPrecondition function tests", function() {
        const errorMessage = "test error message";

        it("should throw an error for missing function arguments", () => {
            try {
                preconditions.checkPrecondition("");
            } catch(error) {
                const { message } = error
                expect(message).to.equal(MISSING_FUNCTION_ARGUMENT_MESSAGE);
            }
        });

        it("should throw an error with the error message if the checkFunction returns true", () => {
            try {
                preconditions.checkPrecondition("", isUndefined, errorMessage)
            } catch(error) {
                expect(error.message).to.equal(errorMessage);
            }
        });

        it("should not throw an error if the checkFunction returns false", () => {
            let error = undefined;
            try {
                preconditions.checkPrecondition("hello", isUndefined, errorMessage);
            } catch(e) {
                error = e;
            }
            expect(error).to.be.undefined;
        });
    });
});