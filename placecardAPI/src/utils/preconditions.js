const { isUndefined } = require("lodash");
const { TYPE_TO_SCHEMA } = require("../constants/schemaTypes");
const { MISSING_FUNCTION_ARGUMENT_MESSAGE } = require("../constants/errorMessages");

function checkPrecondition(value, checkFunction, errorMessage) {
    if (isUndefined(value) || isUndefined(checkFunction) || isUndefined(errorMessage)) {
        throw new Error(MISSING_FUNCTION_ARGUMENT_MESSAGE);
    }

    if (checkFunction(value)) {
        throw new Error(errorMessage);
    }
}

function validateSchema(input, schemaType) {
    const schema = TYPE_TO_SCHEMA[schemaType];
    const response = schema.validate(input);
    if (!isUndefined(response.error)) {
        const errorDetails = response.error.details[0];
        throw new Error(errorDetails.message)
    }
}

module.exports = {
    checkPrecondition,
    validateSchema
};