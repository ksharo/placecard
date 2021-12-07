function checkPrecondition(value, checkFunction, errorMessage) {
    if (checkFunction(value)) {
        throw new Error(errorMessage);
    }
}

module.exports = {
    checkPrecondition
};