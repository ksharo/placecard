const ERROR_TYPES = require("./errorTypes");
const EventSchema = require("../schema/Event");
const GuestSchema = require("../schema/Guest");
const EmailPostBodySchema = require("../schema/request/email");

const SCHEMA_TYPES = {
    EVENT: "Event",
    GUEST: "Guest",
    EMAIL_POST_BODY: "EmailPostBody"
};

const SCHEMA_TO_ERROR = Object.freeze({
    [SCHEMA_TYPES.EVENT]: ERROR_TYPES.INVALID_EVENT,
    [SCHEMA_TYPES.GUEST]: ERROR_TYPES.INVALID_GUEST,
    [SCHEMA_TYPES.EMAIL_POST_BODY]: ERROR_TYPES.INVALID_EMAIL_CONFIG
});

const TYPE_TO_SCHEMA = Object.freeze({
    [SCHEMA_TYPES.EVENT]: EventSchema,
    [SCHEMA_TYPES.GUEST]: GuestSchema,
    [SCHEMA_TYPES.EMAIL_POST_BODY]: EmailPostBodySchema
});

module.exports = {
    SCHEMA_TYPES,
    SCHEMA_TO_ERROR,
    TYPE_TO_SCHEMA
};