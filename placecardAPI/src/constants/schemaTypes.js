const ERROR_TYPES = require("./errorTypes");
const EventSchema = require("../schema/Event");
const GuestSchema = require("../schema/Guest");

const SCHEMA_TYPES = {
    EVENT: "Event",
    GUEST: "Guest"
};

const SCHEMA_TO_ERROR = Object.freeze({
    [SCHEMA_TYPES.EVENT]: ERROR_TYPES.INVALID_EVENT,
    [SCHEMA_TYPES.GUEST]: ERROR_TYPES.INVALID_GUEST
});

const TYPE_TO_SCHEMA = Object.freeze({
    [SCHEMA_TYPES.EVENT]: EventSchema,
    [SCHEMA_TYPES.GUEST]: GuestSchema
});

module.exports = {
    SCHEMA_TYPES,
    SCHEMA_TO_ERROR,
    TYPE_TO_SCHEMA
};