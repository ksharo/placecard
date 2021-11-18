const { response } = require("express");
const Joi = require("joi");
const { isUndefined } = require("lodash");
const { SCHEMA_TO_ERROR } = require("./schemaTypes");

function validateSchema(schema, input, schemaType) {
    const response = schema.validate(input);
    if (!isUndefined(response.error)) {
        const errorDetails = response.error.details[0]
        const customError = {
            message: errorDetails.message,
            errorType: SCHEMA_TO_ERROR[schemaType],
            type: errorDetails.type
        };
        response.error = customError;
    }
    return response;
}

module.exports = {
    validateSchema
};