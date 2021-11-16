const Joi = require("joi");
const { isUndefined } = require("lodash");

const SCHEMA_TYPES = {
    EVENT: "Event",
    GUEST: "Guest"
};

function validateSchema(schema, input, type) {
    const response = schema.validate(input);
    if (!isUndefined(response.error)) {
        response.error.schemaType = type;
    }
    return response;
}

module.exports = {
    SCHEMA_TYPES,
    validateSchema
};