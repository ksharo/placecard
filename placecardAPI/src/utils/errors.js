const CustomAPIError = require("./customAPIError");

function generateCRUDErrorMessage(operationMessage, schemaType) {
    return `${operationMessage} (${schemaType})`;
}

function generateNotFoundMessage(messagePrefix, id) {
    return `${messagePrefix} id=${id}`;
}

function generateErrorMessage(error) {
    return `${error.name}: ${error.message}`;
}

function createErrorResponse(message, type, status, res) {
    const errorResponse = { 
        error: new CustomAPIError(message, type, status)
    };
    return res.status(status).json(errorResponse);
}

module.exports = {
    generateCRUDErrorMessage,
    generateNotFoundMessage,
    generateErrorMessage,
    createErrorResponse
}