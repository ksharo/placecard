const eventsRoutes = require("./eventRoutes");
const guestRoutes = require("./guestRoutes");
const userRoutes = require("./userRoutes");

const constructorMethod = (app) => {
    app.use('/events', eventsRoutes);
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
