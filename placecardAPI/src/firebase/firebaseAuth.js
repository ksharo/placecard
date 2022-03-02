const _ = require("lodash");
const { getAuth } = require("firebase-admin/auth");


function FirebaseAuth(firebaseApp) {
    this.firebaseAuth = getAuth(firebaseApp);
}

module.exports = FirebaseAuth;
