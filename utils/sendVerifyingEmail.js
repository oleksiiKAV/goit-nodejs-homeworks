const sgMail = require("@sendgrid/mail");

require("dotenv").config();


const {SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async data => {
    const email = {...data, from: "oleksii.kav@gmail.com"};
    console.log(email)
    await sgMail.send(email);
    return true;
}

const {BASE_URL} = process.env;

const sendVerifyingEmail = async ({email, verificationToken}) => {
    
    const verifyEmail = {
        to: email,
        subject: "Email verification",
        html: `<a target = "_blank" href = "${BASE_URL}/api/users/verify/${verificationToken}">
            Verify email</a>`,
    };
   
    await sendEmail(verifyEmail);
    
}

module.exports = sendVerifyingEmail;
