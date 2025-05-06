import nodemailer from 'nodemailer'

//create trporter
// OptionMailer
// send mailer

// create transporter
const sendVerificationEmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_POST,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }

        })

        // verification email
        const verificationUrl = `$(process.env.BASE_URL)/api/v1/users/verify/${token}`

        // email content
        const mailOptions = {
            from: `"Authentication App" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: 'Verify your email address',
            text: `please click on the link to verify your email address ${verificationUrl}`
        }

        // send email
        const info = await transporter.sendMail(mailOptions)
        console.log('massge sent', info.messageId);
        return true


        

    } catch (error) {
        console.log('error in sending  email ', error);
        return false

    }

}

export { sendVerificationEmail }