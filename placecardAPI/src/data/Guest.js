const { isUndefined, isEmpty } = require("lodash");
const { guests } = require("../../config/mongoConfig/mongoCollections");
const { checkPrecondition } = require("../utils/preconditions");
const { INVALID_GUEST_ID_MESSAGE, GUEST_EMPTY_MESSAGE} = require("../constants/errorMessages");

async function createGuest(guestConfig) {
    checkPrecondition(guestConifg, isUndefined, INVALID_GUEST_ID_MESSAGE);
    checkPrecondition(guestConfig, isEmpty, GUEST_EMPTY_MESSAGE);
}

module.exports = {
    createGuest
}