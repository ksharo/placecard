const eventsRoutes = require('./events');
const userRoutes = require('./users');

const constructorMethod = (app) => {
    app.use('/events', eventsRoutes);
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
