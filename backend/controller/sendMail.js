
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const CLIENT_ID = '405740759317-6tcr8hmkn01qkr0gavfdo4nb3jvv2mg6.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04DqUFOc6Fiy5CgYIARAAGAQSNwF-L9IrhkbUbKGTp3pQy4G9wiZc1pH2udEl9djsnUgkza7O3NTNVAR6LC3INQN2I0z7MUdJs8g';

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
                user: 'pratik2000gaikwad@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'iNotebook <pratik2000gaikwad@gmail.com>',
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
