const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { guests, events } = require("../data");
const multer = require("multer");

// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/src/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

const {
    INVALID_GUEST_ID_MESSAGE,
    GUEST_UNDEFINED_MESSAGE,
    GUEST_EMPTY_MESSAGE,
} = require("../constants/errorMessages");
const {
    generateErrorMessage,
    createErrorResponse,
} = require("../utils/errors");
const { SCHEMA_TYPES } = require("../constants/schemaTypes");
const { validateSchema } = require("../utils/preconditions");
const { checkPrecondition } = require("../utils/preconditions");
const statusCodes = require("../constants/statusCodes");
const ERROR_TYPES = require("../constants/errorTypes");
const { isInvalidObjectId } = require("../utils/mongoUtils");
const { INVALID_GUEST_ID } = require("../constants/errorTypes");

router.get("/:guestId", async (req, res) => {
    let guestId = req.params.guestId.trim();
    try {
        checkPrecondition(guestId, _.isUndefined, INVALID_GUEST_ID_MESSAGE);
        checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_GUEST_ID,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        const guest = await guests.getGuest(guestId);
        return res.json(guest);
    } catch (e) {
        return createErrorResponse(
            generateErrorMessage(e),
            ERROR_TYPES.GUEST_NOT_FOUND,
            statusCodes.NOT_FOUND,
            res
        );
    }
});

router.post("/newGuest/:eventId", async (req, res) => {
    const newGuest = req.body;
    const eventId = req.params.eventId.trim();
    try {
        checkPrecondition(newGuest, _.isUndefined, GUEST_UNDEFINED_MESSAGE);
        checkPrecondition(newGuest, _.isEmpty, GUEST_EMPTY_MESSAGE);
        validateSchema(newGuest, SCHEMA_TYPES.GUEST);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_GUEST,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        const createdGuest = await guests.createGuest(newGuest);
        let sendSurvey = false;
        if (createdGuest.survey_response !== undefined) {
            sendSurvey = true;
        }
        await events.addGuest(eventId, createdGuest._id, sendSurvey);
        return res.json(createdGuest);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INSERT_ERROR,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});

router.put("/updateGuest", async (req, res) => {
    const updatedGuest = req.body;

    try {
        checkPrecondition(updatedGuest, _.isUndefined, GUEST_UNDEFINED_MESSAGE);
        checkPrecondition(updatedGuest, _.isEmpty, GUEST_EMPTY_MESSAGE);
        validateSchema(updatedGuest, SCHEMA_TYPES.GUEST);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_GUEST,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        const guestId = updatedGuest._id;
        checkPrecondition(guestId, _.isUndefined, INVALID_GUEST_ID_MESSAGE);
        checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_GUEST_ID,
            INVALID_GUEST_ID,
            res
        );
    }

    try {
        const guestId = updatedGuest._id;
        delete updatedGuest._id;
        const updatedGuestRet = await guests.updateGuest(
            guestId,
            updatedGuest,
            "PUT"
        );
        return res.json(updatedGuestRet);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.UPDATE_ERROR,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});

router.patch("/updateGuest", async (req, res) => {
    const updatedGuest = req.body;

    try {
        checkPrecondition(updatedGuest, _.isUndefined, GUEST_UNDEFINED_MESSAGE);
        checkPrecondition(updatedGuest, _.isEmpty, GUEST_EMPTY_MESSAGE);
        validateSchema(updatedGuest, SCHEMA_TYPES.GUESTPATCH);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_GUEST,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        const guestId = updatedGuest._id;
        checkPrecondition(guestId, _.isUndefined, INVALID_GUEST_ID_MESSAGE);
        checkPrecondition(guestId, isInvalidObjectId, INVALID_GUEST_ID_MESSAGE);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_GUEST_ID,
            INVALID_GUEST_ID,
            res
        );
    }

    try {
        const guestId = updatedGuest._id;
        delete updatedGuest._id;
        const updatedGuestRet = await guests.updateGuest(
            guestId,
            updatedGuest,
            "PATCH"
        );
        return res.json(updatedGuestRet);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.UPDATE_ERROR,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});

router.delete("/:guestId", async (req, res) => {
    const guestId = req.params.guestId.trim();
    try {
        checkPrecondition(guestId, _.isUndefined, INVALID_GUEST_ID_MESSAGE);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.INVALID_GUEST,
            statusCodes.BAD_REQUEST,
            res
        );
    }

    try {
        const guest = await guests.getGuest(guestId);
    } catch (e) {
        return createErrorResponse(
            generateErrorMessage(e),
            ERROR_TYPES.GUEST_NOT_FOUND,
            statusCodes.NOT_FOUND,
            res
        );
    }

    try {
        await guests.deleteGuest(guestId);
        const response = {
            snapshot_id: guestId,
        };
        return res.json(response);
    } catch (e) {
        return createErrorResponse(
            e.message,
            ERROR_TYPES.GUEST_NOT_FOUND,
            statusCodes.INTERNAL_SERVER,
            res
        );
    }
});


router.post("/fileUpload", upload.single("file"), async (req, res) => {
    try {
        let formData = req.file;
        let fileType = formData.originalname.split(".").pop();

        if (
            formData.mimetype !== "application/vnd.ms-excel" &&
            formData.mimetype !==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
            formData.mimetype !== "text/csv"
        ) {
            return res.status(400).json({
                error: "Only .xls, .xlsx, and .csv formatted files are allowed!",
            });
        }

        let uploadData = await guests.uploadSurveyData(formData.path, fileType);

        res.status(200).json(uploadData);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});

module.exports = router;
