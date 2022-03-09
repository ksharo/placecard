const dbConnection = require("../config/mongoConfig/mongoConnection");
const data = require("../src/data");
const events = data.events;
const guests = data.guests;

const { uniqueNamesGenerator, Config, countries, names, adjectives, colors, starWars, NumberDictionary } = require('unique-names-generator');

const eventName = uniqueNamesGenerator({
  dictionaries: [adjectives, starWars],
  length: 2,
  separator: " "
});

const tableNames = uniqueNamesGenerator({
  dictionaries: [adjectives, colors],
  length: 2,
  separator: " "
});

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const location = uniqueNamesGenerator({
  dictionaries: [countries]
});

const attendeesPerTable = NumberDictionary.generate({ min: 4, max: 16 });


const guestNames = uniqueNamesGenerator({
  dictionaries: [names]
})

const emailNumber = NumberDictionary.generate({min: 100, max: 999});
const emails = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, emailNumber, ['@gmail.com']],
  length: 4,
  separator: "",
  style: "capital"
})

const phoneNumber = NumberDictionary.generate({min: 0, max: 9});
const phones = uniqueNamesGenerator({
  dictionaries: [phoneNumber, phoneNumber, phoneNumber, ['-'], phoneNumber, phoneNumber, phoneNumber, ['-'], phoneNumber, phoneNumber, phoneNumber, phoneNumber],
  length: 12,
  separator: ""
});

const ageNumber = NumberDictionary.generate({min: 3, max: 99});
const ages = uniqueNamesGenerator({
  dictionaries: [ageNumber],
  length: 1
});



// randomDate(new Date(2012, 0, 1), new Date())

let eventSeed = [];
let guestsSeed = [];


function generateEvents( numEvents ) {
  
}

async function main() {
  const db = await dbConnection.connectToDb();

  

  console.log("Done seeding database");

  await dbConnection.closeConnection();
}

main().catch((error) => {
  console.log(error);
});
