const dbConnection = require("../config/mongoConfig/mongoConnection");
const data = require("../src/data");
const events = data.events;
const guests = data.guests;

const { uniqueNamesGenerator, Config, countries, names, adjectives, colors, starWars, NumberDictionary } = require('unique-names-generator');
const { ObjectId } = require("mongodb");

let eventName = uniqueNamesGenerator({
  dictionaries: [adjectives, starWars],
  length: 2,
  separator: " "
});

let tableNames = uniqueNamesGenerator({
  dictionaries: [adjectives, colors],
  length: 2,
  separator: " "
});

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

let randomLocation = uniqueNamesGenerator({
  dictionaries: [countries]
});

let attendeesPerTable = NumberDictionary.generate({ min: 4, max: 16 });


let guestNames = uniqueNamesGenerator({
  dictionaries: [names, names],
  length: 2,
  separator: " ",
  style: "capital"
})

const emailNumber = NumberDictionary.generate({min: 100, max: 999});
let emails = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, emailNumber, ['@gmail.com']],
  length: 4,
  separator: "",
  style: "capital"
})

const phoneNumber = NumberDictionary.generate({min: 0, max: 9});
let phones = uniqueNamesGenerator({
  dictionaries: [phoneNumber, phoneNumber, phoneNumber, ['-'], phoneNumber, phoneNumber, phoneNumber, ['-'], phoneNumber, phoneNumber, phoneNumber, phoneNumber],
  length: 12,
  separator: ""
});

const partySizeNumber = NumberDictionary.generate({min: 1, max: 10});
let partySizes = uniqueNamesGenerator({
  dictionaries: [partySizeNumber],
  length: 1
});




// randomDate(new Date(2012, 0, 1), new Date())

let eventSeed = [];
let guestsSeed = [];


function generateEvents( numEvents ) {

}

async function main() {
  const db = await dbConnection.connectToDb();

  db.collection("events").drop();
  db.collection("guests").drop();

  let guestsSchemas = [
    {
      first_name: "Guest",
      last_name: "One",
      email: "GuestOne@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Two",
      email: "GuestTwo@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Three",
      email: "GuestThree@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Four",
      email: "GuestFour@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Five",
      email: "GuestFive@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Six",
      email: "GuestSix@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Seven",
      email: "GuestSeven@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Eight",
      email: "GuestEight@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Nine",
      email: "GuestNine@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Ten",
      email: "GuestTen@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Eleven",
      email: "GuestEleven@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Twelve",
      email: "GuestTwelve@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Thirteen",
      email: "GuestThirteen@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Fourteen",
      email: "GuestFourteen@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Fifteen",
      email: "GuestFifteen@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Sixteen",
      email: "GuestSixteen@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Seventeen",
      email: "GuestSeventeen@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Eighteen",
      email: "GuestEighteen@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Nineteen",
      email: "GuestNineteen@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    },
    {
      first_name: "Guest",
      last_name: "Twenty",
      email: "GuestTwenty@gmail.com",
      party_size: 1,
      survey_response: {
        disliked: [],
        liked: [],
        ideal: []
      }
    }
  ]

  const allGuests = [];
  await Promise.all( guestsSchemas.map( async (guestSchema) => {
    const newGuest = await guests.createGuest(guestSchema);
    allGuests.push(newGuest._id);
  }));

  let table_list = [
    {
      'id': new ObjectId(),
      'name': 'Table 1',
      'guests': []
    },
    {
      'id': new ObjectId(),
      'name': 'Table 2',
      'guests': []
    },
    {
      'id': new ObjectId(),
      'name': 'Table 3',
      'guests': []
    },
    {
      'id': new ObjectId(),
      'name': 'Table 4',
      'guests': []
    }
  ];

  let master_event_schema = {
    event_name: "Event 1",
    _userId: "BUTVFngo8WfgLdD0LJycLEz97ph2",
    tables: table_list,
    event_start_time: 2223646857962,
    location: "Hoboken",
    attendees_per_table: 8,
    guest_list: allGuests,
    surveys_sent: allGuests
  }


  await events.createEvent(master_event_schema);

  console.log("Done seeding database");

  await dbConnection.closeConnection();
}

main().catch((error) => {
  console.log(error);
});
