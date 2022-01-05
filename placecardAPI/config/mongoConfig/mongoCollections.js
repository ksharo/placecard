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
<<<<<<< HEAD
  events: getCollection("events"),
};
=======
    events: getCollection("events"),
    guests: getCollection("guests")
};
>>>>>>> Refactored schema validation function and added custom API error handling
