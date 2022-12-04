const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({

        service: "gmail",
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        html: `<h2>Hello ${options.name}</h2><br>
                <p>${options.message}</p>    `
    }
    await transporter.sendMail(mailOptions)
}

module.exports = { sendEmail }