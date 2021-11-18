const { MongoClient } = require('mongodb');
const { isUndefined } = require('lodash');
const { mongoConfig } = require('./mongoSettings');

let connection = undefined;
let db = undefined;

module.exports = async() => {
    if (isUndefined(connection)) {
        connection = await MongoClient.connect(mongoConfig.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        db = await connection.db(mongoConfig.database);
    }
    return db;
}