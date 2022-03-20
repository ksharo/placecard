function checkThrowError(func, args) {
    let error = undefined;
    try {
        func(...args);
    } catch (e) {
        error = e;
    }
    return error;
}

module.exports = {
    checkThrowError
};
