const INVALID_EVENT_ID_MESSAGE = "Event ID is not a valid non-empty string";
const NO_EVENT_FOUND_MESSAGE = "No event found for";
const EVENT_UNDEFINED_MESSAGE = "Input event is undefined";
const EVENT_EMPTY_MESSAGE = "Event body cannot be empty";

const INSERT_ERROR_MESSAGE  = "An insert error occurred while trying to CREATE a document";
const UPDATE_ERROR_MESSAGE = "An error occurred while trying to UPDATE a document";
const DELETE_ERROR_MESSAGE = "An error occurred while trying to DELETE a document";

module.exports = Object.freeze({
    INVALID_EVENT_ID_MESSAGE,
    NO_EVENT_FOUND_MESSAGE,
    EVENT_UNDEFINED_MESSAGE,
    EVENT_EMPTY_MESSAGE,
    INSERT_ERROR_MESSAGE ,
    UPDATE_ERROR_MESSAGE,
    DELETE_ERROR_MESSAGE
});