const { MongoClient } = require('mongodb');
const mongoSettings = require('./mongoSettings');
const mongoConfig = mongoSettings.mongoConfig;

MongoClient.connect(mongoConfig.dbUrl, (err, client) => {
    
});