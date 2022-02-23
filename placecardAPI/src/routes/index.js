const eventsRoutes = require("./eventRoutes");
const guestRoutes = require("./guestRoutes");
var cors = require("cors");

// TODO: make cors only for our apps
const constructorMethod = (app) => {
    app.options("/events", cors());
    app.use("/events", cors(), eventsRoutes);

    app.use("/events", eventsRoutes);
    app.use("/guests", guestRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
