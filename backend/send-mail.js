const nodemailer = require("nodemailer");


async function sendMail(email_id, subject, text){

    try {
        let transporter = await nodemailer.createTransport(
            {
                service: "outlook",
                auth: {
                    user: "TheSqlSquad.HMS@outlook.com",
                    pass: "HMS@1234", 
                }
            });
        let info = await transporter.sendMail({
            from: "TheSqlSquad.HMS@outlook.com",
            to: email_id,
            subject: subject,
            text: text
        });
        console.log('Email sent' );
    
    } catch (err) {
        console.error('Error occurred: ' + err.message + "\n\n");
        
    }

};




module.exports = sendMail;
