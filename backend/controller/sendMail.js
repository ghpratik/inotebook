const nodemailer = require("nodemailer");
const {google} = require("googleapis");
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(email, name, otp) {
    if(!name){
        name=''
    }
    try {
        const accessToken = await oAuth2client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'inotebookofficial@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'iNotebook <inotebookofficial@gmail.com>',
            to: `${email}`,
            subject: "iNotebook - Signed Up",
            text: `Hi ${name}, Enter Below One Time Password to verify your E-mail. Login to iNotebook with this E-mail and Save your notes in cloud`,
            html: `<h1>Hi ${name},</h1><h2>Enter Below One Time Password to verify your E-mail.</h2><h2>One Time Password: ${otp}</h2><p>Secure your notes in cloud.</p>`
        }

        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        return error
    }
}
// sendMail().then(result => console.log('Email sent...', result)).catch(error => console.log(error.message));
module.exports = sendMail;
