const { isUndefined } = require("lodash");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailRequest(emailConfig) {
    try {
        const response = await sgMail.send(emailConfig);
        return response;
    } catch (error) {
        return error;
    }
}

function hasError(config) {
    return !isUndefined(config.error);
}

module.exports = {
    sendEmailRequest,
    hasError
};
