const { isUndefined } = require("lodash");
const { TYPE_TO_SCHEMA } = require("../constants/schemaTypes");

function checkPrecondition(value, checkFunction, errorMessage) {
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