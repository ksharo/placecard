
// function generateInsertError(input, type) {
//     return `${INSERT_ERROR_MESSAGE} ${type}: ${input}`;
// }

function generateCRUDErrorMessage(operationMessage, schemaType) {
    return `${operationMessage} (${schemaType})`;
}

function generateNotFoundMessage(messagePrefix, id) {
    return `${messagePrefix} id=${id}`;
}

function generateErrorMessage(error) {
    return `${error.name}: ${error.message}`;
}

module.exports = {
    generateCRUDErrorMessage,
    generateNotFoundMessage,
    generateErrorMessage
}