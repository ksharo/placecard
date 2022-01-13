const dbConnection = require('./mongoConnection');
const { isUndefined } = require('lodash');

const getCollection = (collection) => {
    let col = undefined;
    return async() => {
        if (isUndefined(col)) {
            console.log('about to await')
            const db = await dbConnection();
            console.log(db)
            col = await db.collection(collection);
        }
        return col;
    };
};

module.exports = {
    events: getCollection('events')
};