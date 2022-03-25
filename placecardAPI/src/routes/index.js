const eventsRoutes = require("./events");
const guestRoutes = require("./guests");
const notificationRoutes = require("./notifications");
let cors = require("cors");

// TODO: make cors only for our apps
const constructorMethod = (app) => {
    app.options("/events", cors());
    app.use("/events", cors(), eventsRoutes);
    app.options("/guests", cors());
    app.use("/guests", cors(), guestRoutes);

    app.use("/events", eventsRoutes);
    app.use("/guests", guestRoutes);
    app.use("/notifications", notificationRoutes);
    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
