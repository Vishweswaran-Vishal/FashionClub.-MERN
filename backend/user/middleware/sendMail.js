import { createTransport } from "nodemailer"

const sendMail = async(email, subject, text) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    await transport.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject,
        text
    });
}

export default sendMail;