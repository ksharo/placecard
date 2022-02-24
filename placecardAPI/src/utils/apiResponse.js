const { isUndefined } = require("lodash");
const { MISSING_FUNCTION_ARGUMENT_MESSAGE } = require("../constants/errorMessages");
const { OK } = require("../constants/statusCodes");

function SuccessResponse(message) {
    this.message = message;
    this.status = OK;
}

function createSuccessResponse(message, res) {
    if (isUndefined(message) || isUndefined (res)) {
        throw new Error(MISSING_FUNCTION_ARGUMENT_MESSAGE);
    }
    const successResponse = new SuccessResponse(message);
    return res.json(successResponse);
}

module.exports = {
    createSuccessResponse
};