async function checkThrowError(func, args) {
    let error = undefined;
    try {
        await func(...args);
    } catch (e) {
        error = e;
    }
    return error;
}

function mockGetCollection(stubConfigs) {
    return async () => {
        return {
            ...stubConfigs
        };
    }
}

function mockUpdate(currentObject, updatedConfig) {
    const updatedObject = Object.entries(updatedConfig).reduce((prevObject, [key, value]) => {
        return {
            ...prevObject,
            [key]: value
        }
    }, {...currentObject});

    return updatedObject;
}

module.exports = {
    checkThrowError,
    mockGetCollection,
    mockUpdate
};
