const { MongoClient } = require('mongodb');
const { isUndefined } = require('lodash');
const { mongoConfig } = require('./mongoSettings');

let connection = undefined;
let db = undefined;

module.exports = async() => {
    if (isUndefined(connection)) {
        console.log('db1')
        console.log(mongoConfig.dbUrl);
        connection = await MongoClient.connect(mongoConfig.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('db2')
        db = await connection.db(mongoConfig.database);
        console.log('db3')
    }
    return db;
}