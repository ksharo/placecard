const dbConnection = require("../config/mongoConfig/mongoConnection");
const data = require("../src/data");
const events = data.events;
// const guests         = data.guests;

async function main() {
  const db = await dbConnection.connectToDb();

  let walmartwedding = await events.createEvent({
    event_name: "testEvent",
    tables: [],
    event_time: 300,
    expected_number_of_attendees: 100,
    attendees_per_table: 10,
  });
  console.log(walmartwedding._id);

  console.log("Done seeding database");

  await dbConnection.closeConnection();
}

main().catch((error) => {
  console.log(error);
});
