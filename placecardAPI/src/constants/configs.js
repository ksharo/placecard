const { EMAIL_TEMPLATE_SUBJECT  } = require("./messages");

const baseEmailConfig = {
    from: process.env.PLACECARD_EMAIL,
    subject: EMAIL_TEMPLATE_SUBJECT,
    templateId: process.env.SENDGRID_TEMPLATE_ID,
};

module.exports = baseEmailConfig;
