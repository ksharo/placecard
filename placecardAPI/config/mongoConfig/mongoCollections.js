const dbConnection = require('./mongoConnection');
const { isUndefined } = require('lodash');

const getCollection = (collection) => {
    let col = undefined;
    return async() => {
        if (isUndefined(col)) {
            const db = await dbConnection();
            col = await db.collection(collection);
        }
        return col;
    };
};

module.exports = {
    events: getCollection('events')
};