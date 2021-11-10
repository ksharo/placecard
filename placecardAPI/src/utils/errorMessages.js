const INVALID_EVENT_ID = "Event ID is not a valid non-empty string";
const NO_EVENT_FOUND = "No event found for";

function generateNotFoundMessage(messagePrefix, id) {
    return `${messagePrefix} id=${id}`;
}

function generateErrorMessage(error) {
    return `${error.name}: ${error.message}`;
}

module.exports = {
    INVALID_EVENT_ID,
    NO_EVENT_FOUND,
    generateNotFoundMessage,
    generateErrorMessage
};
