const express = require("express");
const router = express.Router();
const { events } = require("../data");
const { generateErrorMessage } = require('../utils/errorMessages');

router.get("/:eventId", async(req, res) => {
    try {
        const event = await events.getEvent(req.params.eventId);
        return res.json(event);
    } catch (e) {
        const error = {
            errorMessage: generateErrorMessage(e)
        };
        return res.status(404).json(error);
    }
});

module.exports = router;
