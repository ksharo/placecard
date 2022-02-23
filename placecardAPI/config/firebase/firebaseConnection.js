const  { initializeApp } = require("firebase-admin/app");
const firebaseConfig = require("./firebaseConfig");

const firebaseApp = initializeApp(firebaseConfig);

module.exports = firebaseApp;