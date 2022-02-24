const INVALID_EVENT_ID_MESSAGE = "Event ID is not a valid non-empty string";
const INVALID_GUEST_ID_MESSAGE = "Guest ID is not a valid non-empty string";

const NO_EVENT_FOUND_MESSAGE = "No event found for";
const NO_GUEST_FOUND_MESSAGE = "No guest found for";

const GUEST_UNDEFINED_MESSAGE = "Input guest is undefined";
const EVENT_UNDEFINED_MESSAGE = "Input event is undefined";
const EVENT_EMPTY_MESSAGE = "Event body cannot be empty";
const GUEST_EMPTY_MESSAGE = "Guest body cannot be empty";

const INSERT_ERROR_MESSAGE =
    "An insert error occurred while trying to CREATE a document";
const UPDATE_ERROR_MESSAGE =
    "An error occurred while trying to UPDATE a document";
const DELETE_ERROR_MESSAGE =
    "An error occurred while trying to DELETE a document";

const MISSING_FUNCTION_ARGUMENT_MESSAGE = "Missing argument(s) for function";

const EMAIL_SEND_FAILED = "Email could not be sent";
const EMAIL_CONFIG_EMPTY = "Email configuration cannot empty"
const EMAIL_CONFIG_MISSING_PROP = "Email configuration is missing the 'to' property which indicates email recipient";

module.exports = Object.freeze({
    INVALID_EVENT_ID_MESSAGE,
    INVALID_GUEST_ID_MESSAGE,
    NO_EVENT_FOUND_MESSAGE,
    NO_GUEST_FOUND_MESSAGE,
    EVENT_UNDEFINED_MESSAGE,
    EVENT_EMPTY_MESSAGE,
    GUEST_UNDEFINED_MESSAGE,
    GUEST_EMPTY_MESSAGE,
    INSERT_ERROR_MESSAGE,
    UPDATE_ERROR_MESSAGE,
    DELETE_ERROR_MESSAGE,
    MISSING_FUNCTION_ARGUMENT_MESSAGE,
    EMAIL_SEND_FAILED,
    EMAIL_CONFIG_EMPTY,
    EMAIL_CONFIG_MISSING_PROP
});
