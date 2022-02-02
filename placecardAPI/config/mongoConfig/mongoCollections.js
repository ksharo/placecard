const dbConnection = require("./mongoConnection");
const { isUndefined } = require("lodash");

const getCollection = (collection) => {
  let col = undefined;
  return async () => {
    if (isUndefined(col)) {
      const db = await dbConnection.connectToDb();
      col = await db.collection(collection);
    }
    return col;
  };
};

module.exports = {
    events: getCollection("events"),
    guests: getCollection("guests")
};
