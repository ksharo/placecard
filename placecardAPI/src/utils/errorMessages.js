const INVALID_EVENT_ID = "Event ID is not a valid non-empty string";
const NO_EVENT_FOUND = "No event found for";
const EVENT_UNDEFINED = "Input event is undefined";
const INSERT_ERROR  = "An insert error occurred while trying to create an";

const ERROR_TYPES = {
    INVALID_EVENT: "InvalidEventInput",
    INVALID_GUEST: "InvalidGuestInput"
};

function generateInsertError(input, type) {
    return `${INSERT_ERROR} ${type}: ${input}`;
}

function generateNotFoundMessage(messagePrefix, id) {
    return `${messagePrefix} id=${id}`;
}

function generateErrorMessage(error) {
    return `${error.name}: ${error.message}`;
}

module.exports = {
    INVALID_EVENT_ID,
    NO_EVENT_FOUND,
    EVENT_UNDEFINED,
    ERROR_TYPES,
    generateNotFoundMessage,
    generateInsertError,
    generateErrorMessage
};
