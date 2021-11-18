const { schema } = require("../data/schema/EventSchema");
const { ERROR_TYPES } = require("./errorMessages");

const SCHEMA_TYPES = {
    EVENT: "Event",
    GUEST: "Guest"
};

const SCHEMA_TO_ERROR = Object.freeze({
    [SCHEMA_TYPES.EVENT]: ERROR_TYPES.INVALID_EVENT,
    [SCHEMA_TYPES.GUEST]: ERROR_TYPES.INVALID_GUEST
});

module.exports = {
    SCHEMA_TYPES,
    SCHEMA_TO_ERROR
};