const eventsRoutes = require("./eventRoutes");
const guestRoutes = require("./guestRoutes");
const userRoutes = require("./userRoutes");
var cors = require('cors');

// TODO: make cors only for our apps
const constructorMethod = (app) => {
<<<<<<< HEAD
    app.options('/events', cors());
    app.use('/events', cors(), eventsRoutes);
=======
    app.use("/events", eventsRoutes);
    // app.use("/guests", guestRoutes);

>>>>>>> Refactored schema validation function and added custom API error handling
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
