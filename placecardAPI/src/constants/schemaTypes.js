const ERROR_TYPES = require("./errorTypes");
const EventSchema = require("../schema/Event");
const EventPatchSchema = require("../schema/EventPatch");
const GuestSchema = require("../schema/Guest");
const GuestPatchSchema = require("../schema/GuestPatch");

const SCHEMA_TYPES = {
    EVENT: "Event",
    EVENTPATCH: "EventPatch",
    GUEST: "Guest",
    GUESTPATCH: "GuestPatch",
};

const SCHEMA_TO_ERROR = Object.freeze({
    [SCHEMA_TYPES.EVENT]: ERROR_TYPES.INVALID_EVENT,
    [SCHEMA_TYPES.EVENTPATCH]: ERROR_TYPES.INVALID_EVENT,
    [SCHEMA_TYPES.GUEST]: ERROR_TYPES.INVALID_GUEST,
    [SCHEMA_TYPES.GUESTPATCH]: ERROR_TYPES.INVALID_GUEST,
});

const TYPE_TO_SCHEMA = Object.freeze({
    [SCHEMA_TYPES.EVENT]: EventSchema,
    [SCHEMA_TYPES.EVENTPATCH]: EventPatchSchema,
    [SCHEMA_TYPES.GUEST]: GuestSchema,
    [SCHEMA_TYPES.GUESTPATCH]: GuestPatchSchema,
});

module.exports = {
    SCHEMA_TYPES,
    SCHEMA_TO_ERROR,
    TYPE_TO_SCHEMA,
};
