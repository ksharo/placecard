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

  const Steve_Rogers_Group_Id = (new ObjectId()).toString();


	let Steve_Rogers_survey_response = {
		disliked:[

		],
		liked: [

		],
		ideal: [

		]
	}



	let guestSchemas = [
	{
		first_name: "Tony Stark",
		last_name: "Tony Stark",
		email: "Tony Stark@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Tony Stark",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Steve Rogers",
		last_name: "Steve Rogers",
		email: "Steve Rogers@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Steve Rogers",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Thor",
		last_name: "Thor",
		email: "Thor@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Thor",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Loki",
		last_name: "Loki",
		email: "Loki@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Loki",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Groot",
		last_name: "Groot",
		email: "Groot@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Groot",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Thanos",
		last_name: "Thanos",
		email: "Thanos@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Thanos",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Rocket",
		last_name: "Rocket",
		email: "Rocket@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Rocket",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Peter Parker",
		last_name: "Peter Parker",
		email: "Peter Parker@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Peter Parker",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Peter Parker 2",
		last_name: "Peter Parker 2",
		email: "Peter Parker 2@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Peter Parker 2",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Peter Parker 3",
		last_name: "Peter Parker 3",
		email: "Peter Parker 3@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Peter Parker 3",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Green Goblin",
		last_name: "Green Goblin",
		email: "Green Goblin@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Green Goblin",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Sandman",
		last_name: "Sandman",
		email: "Sandman@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Sandman",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Venom",
		last_name: "Venom",
		email: "Venom@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Venom",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Electro Dude",
		last_name: "Electro Dude",
		email: "Electro Dude@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Electro Dude",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Doc Oc",
		last_name: "Doc Oc",
		email: "Doc Oc@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Doc Oc",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Steven Strange",
		last_name: "Steven Strange",
		email: "Steven Strange@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Steven Strange",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Lizard Guy",
		last_name: "Lizard Guy",
		email: "Lizard Guy@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Lizard Guy",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Ned",
		last_name: "Ned",
		email: "Ned@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Ned",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "MJ",
		last_name: "MJ",
		email: "MJ@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "MJ",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Heimdall",
		last_name: "Heimdall",
		email: "Heimdall@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Heimdall",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Oden",
		last_name: "Oden",
		email: "Oden@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Oden",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Hulk",
		last_name: "Hulk",
		email: "Hulk@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Hulk",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Black Widow",
		last_name: "Black Widow",
		email: "Black Widow@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Black Widow",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Hawkeye",
		last_name: "Hawkeye",
		email: "Hawkeye@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Hawkeye",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Winter Soldier",
		last_name: "Winter Soldier",
		email: "Winter Soldier@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Winter Soldier",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Falcon",
		last_name: "Falcon",
		email: "Falcon@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Falcon",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Wanda",
		last_name: "Wanda",
		email: "Wanda@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Wanda",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Vision",
		last_name: "Vision",
		email: "Vision@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Vision",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Black Panther",
		last_name: "Black Panther",
		email: "Black Panther@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Black Panther",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Shuri",
		last_name: "Shuri",
		email: "Shuri@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Shuri",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Killmonger",
		last_name: "Killmonger",
		email: "Killmonger@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Killmonger",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Okoye",
		last_name: "Okoye",
		email: "Okoye@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Okoye",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Captain Marvel",
		last_name: "Captain Marvel",
		email: "Captain Marvel@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Captain Marvel",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Nick Fury",
		last_name: "Nick Fury",
		email: "Nick Fury@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Nick Fury",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Agent Carter",
		last_name: "Agent Carter",
		email: "Agent Carter@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Agent Carter",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Yelena Belova",
		last_name: "Yelena Belova",
		email: "Yelena Belova@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Yelena Belova",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Dreykov",
		last_name: "Dreykov",
		email: "Dreykov@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Dreykov",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Antman",
		last_name: "Antman",
		email: "Antman@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Antman",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Wasp",
		last_name: "Wasp",
		email: "Wasp@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Wasp",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Yellowjacket",
		last_name: "Yellowjacket",
		email: "Yellowjacket@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Yellowjacket",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Redskull",
		last_name: "Redskull",
		email: "Redskull@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Redskull",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Chris Pratt",
		last_name: "Chris Pratt",
		email: "Chris Pratt@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Chris Pratt",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Leslie Knope",
		last_name: "Leslie Knope",
		email: "Leslie Knope@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Leslie Knope",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Ron Swanson",
		last_name: "Ron Swanson",
		email: "Ron Swanson@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Ron Swanson",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "April Ludgate",
		last_name: "April Ludgate",
		email: "April Ludgate@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "April Ludgate",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Geri Gergich",
		last_name: "Geri Gergich",
		email: "Geri Gergich@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Geri Gergich",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Chris Traeger",
		last_name: "Chris Traeger",
		email: "Chris Traeger@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Chris Traeger",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Ann Perkins",
		last_name: "Ann Perkins",
		email: "Ann Perkins@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Ann Perkins",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Ben Wyatt",
		last_name: "Ben Wyatt",
		email: "Ben Wyatt@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Ben Wyatt",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Tom Haverford",
		last_name: "Tom Haverford",
		email: "Tom Haverford@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Tom Haverford",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Tammy1",
		last_name: "Tammy1",
		email: "Tammy1@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Tammy1",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Tammy2",
		last_name: "Tammy2",
		email: "Tammy2@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Tammy2",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Jean-Ralphio",
		last_name: "Jean-Ralphio",
		email: "Jean-Ralphio@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Jean-Ralphio",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Donna Meagle",
		last_name: "Donna Meagle",
		email: "Donna Meagle@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Donna Meagle",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Lucy",
		last_name: "Lucy",
		email: "Lucy@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Lucy",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Snow White",
		last_name: "Snow White",
		email: "Snow White@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Snow White",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Sleepy",
		last_name: "Sleepy",
		email: "Sleepy@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Sleepy",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Grumpy",
		last_name: "Grumpy",
		email: "Grumpy@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Grumpy",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Sneezy",
		last_name: "Sneezy",
		email: "Sneezy@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Sneezy",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Evil Queen",
		last_name: "Evil Queen",
		email: "Evil Queen@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Evil Queen",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Bashful",
		last_name: "Bashful",
		email: "Bashful@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Bashful",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Doc",
		last_name: "Doc",
		email: "Doc@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Doc",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Dopey",
		last_name: "Dopey",
		email: "Dopey@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Dopey",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Prince Charming",
		last_name: "Prince Charming",
		email: "Prince Charming@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Prince Charming",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Happy",
		last_name: "Happy",
		email: "Happy@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Happy",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Mickey Mouse",
		last_name: "Mickey Mouse",
		email: "Mickey Mouse@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Mickey Mouse",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Pluto",
		last_name: "Pluto",
		email: "Pluto@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Pluto",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Minnie Mouse",
		last_name: "Minnie Mouse",
		email: "Minnie Mouse@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Minnie Mouse",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Goofy",
		last_name: "Goofy",
		email: "Goofy@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Goofy",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Chip",
		last_name: "Chip",
		email: "Chip@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Chip",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Dale",
		last_name: "Dale",
		email: "Dale@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Dale",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Daisy Duck",
		last_name: "Daisy Duck",
		email: "Daisy Duck@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Daisy Duck",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Donald Duck",
		last_name: "Donald Duck",
		email: "Donald Duck@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Donald Duck",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Clarabelle",
		last_name: "Clarabelle",
		email: "Clarabelle@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Clarabelle",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Pete",
		last_name: "Pete",
		email: "Pete@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Pete",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Phineas",
		last_name: "Phineas",
		email: "Phineas@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Phineas",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Ferb",
		last_name: "Ferb",
		email: "Ferb@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Ferb",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Candace",
		last_name: "Candace",
		email: "Candace@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Candace",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Isabella",
		last_name: "Isabella",
		email: "Isabella@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Isabella",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Baljeet",
		last_name: "Baljeet",
		email: "Baljeet@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Baljeet",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Buford",
		last_name: "Buford",
		email: "Buford@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Buford",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Jeremy",
		last_name: "Jeremy",
		email: "Jeremy@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Jeremy",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Suzy",
		last_name: "Suzy",
		email: "Suzy@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Suzy",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Doof",
		last_name: "Doof",
		email: "Doof@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Doof",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Perry",
		last_name: "Perry",
		email: "Perry@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Perry",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Jafar",
		last_name: "Jafar",
		email: "Jafar@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Jafar",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Gaston",
		last_name: "Gaston",
		email: "Gaston@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Gaston",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Captain Hook",
		last_name: "Captain Hook",
		email: "Captain Hook@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Captain Hook",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Scar",
		last_name: "Scar",
		email: "Scar@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Scar",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Maleficent",
		last_name: "Maleficent",
		email: "Maleficent@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Maleficent",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Beauty",
		last_name: "Beauty",
		email: "Beauty@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Beauty",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Beast",
		last_name: "Beast",
		email: "Beast@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Beast",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Aladdin",
		last_name: "Aladdin",
		email: "Aladdin@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Aladdin",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Jasmine",
		last_name: "Jasmine",
		email: "Jasmine@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Jasmine",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Abu",
		last_name: "Abu",
		email: "Abu@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Abu",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Genie",
		last_name: "Genie",
		email: "Genie@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Genie",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Carpet",
		last_name: "Carpet",
		email: "Carpet@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Carpet",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Bob the Tomato",
		last_name: "Bob the Tomato",
		email: "Bob the Tomato@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Bob the Tomato",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Larry the Cucumber",
		last_name: "Larry the Cucumber",
		email: "Larry the Cucumber@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Larry the Cucumber",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
	{
		first_name: "Kaitlyn Sharo",
		last_name: "Kaitlyn Sharo",
		email: "Kaitlyn Sharo@gmai.com",
		party_size: 1,
		group_id: "",
		group_name: "Kaitlyn Sharo",
		survey_response: {
			disliked: [],
			liked: [],
			ideal: []
		}
	},
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
