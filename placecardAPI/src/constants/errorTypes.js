const ERROR_TYPES = {
    INVALID_EVENT: "InvalidEventSchema",
    INVALID_EVENT_ID: "InvalidEventId",
    INVALID_GUEST: "InvalidGuestSchema",
    INVALID_GUEST_ID: "InvalidGuestId",
    EVENT_NOT_FOUND: "EventNotFound",
    GUEST_NOT_FOUND: "GuestNotFound",
    INSERT_ERROR: "InsertError",
    UPDATE_ERROR: "UpdateError",
    DELETE_ERROR: "DeleteError",
    INVALID_EMAIL_CONFIG: "InvalidEmailConfig",
    FAILED_EMAIL_REQUEST: "FailedEmailRequest",
    INVALID_EMAIL_TEMPLATE_DATA: "InvalidEmailTemplateData"
};

// TODO: Create error configs for each type so that they are linked to an object that configures the correct API response

module.exports = Object.freeze(ERROR_TYPES);
