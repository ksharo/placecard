const ERROR_TYPES = require("./errorTypes");
const EventSchema = require("../schema/Event");
const EventPatchSchema = require("../schema/EventPatch");
const GuestSchema = require("../schema/Guest");
const GuestPatchSchema = require("../schema/GuestPatch");
const EmailPostBodySchema = require("../schema/request/email");
const EmailTemplateData = require("../schema/request/templateData");

const SCHEMA_TYPES = {
    EVENT: "Event",
    EVENT_PATCH: "EventPatch",
    GUEST: "Guest",
    GUEST_PATCH: "GuestPatch",
    EMAIL_POST_BODY: "EmailPostBody",
    EMAIL_TEMPLATE_DATA: "EmailTemplateData"
};

const SCHEMA_TO_ERROR = Object.freeze({
    [SCHEMA_TYPES.EVENT]: ERROR_TYPES.INVALID_EVENT,
    [SCHEMA_TYPES.EVENT_PATCH]: ERROR_TYPES.INVALID_EVENT,
    [SCHEMA_TYPES.GUEST]: ERROR_TYPES.INVALID_GUEST,
    [SCHEMA_TYPES.GUEST_PATCH]: ERROR_TYPES.INVALID_GUEST,
    [SCHEMA_TYPES.EMAIL_POST_BODY]: ERROR_TYPES.INVALID_EMAIL_CONFIG,
    [SCHEMA_TYPES.EMAIL_TEMPLATE_DATA]: ERROR_TYPES.INVALID_EMAIL_TEMPLATE_DATA
});

const TYPE_TO_SCHEMA = Object.freeze({
    [SCHEMA_TYPES.EVENT]: EventSchema,
    [SCHEMA_TYPES.EVENT_PATCH]: EventPatchSchema,
    [SCHEMA_TYPES.GUEST]: GuestSchema,
    [SCHEMA_TYPES.GUEST_PATCH]: GuestPatchSchema,
    [SCHEMA_TYPES.EMAIL_POST_BODY]: EmailPostBodySchema,
    [SCHEMA_TYPES.EMAIL_TEMPLATE_DATA]: EmailTemplateData
});

module.exports = {
    SCHEMA_TYPES,
    SCHEMA_TO_ERROR,
    TYPE_TO_SCHEMA
};
