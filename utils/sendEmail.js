const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL,
        pass: process.env.G_PASS,
    },
});

async function sendEmail({otp, email, name, subject, body}) {
    await transporter.sendMail({
        from: '"Learn Easy - Learning makes easy" <admin@learn-easy.com>',
        to: email,
        subject: subject,
        html: body,
    });
}

module.exports = sendEmail;