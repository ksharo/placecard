const sgMail = require("@sendgrid/mail");
const { EMAIL_SEND_FAILED } = require("../constants/errorMessages");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailRequest(emailConfig) {
    try {
        const response = await sgMail.send(emailConfig);
        console.log("Response: ", response);
        console.log("Email was successfully sent");
    } catch (error) {
        throw new Error(EMAIL_SEND_FAILED);
    }
}

module.exports = {
    sendEmailRequest
};
