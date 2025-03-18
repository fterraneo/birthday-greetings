import nodemailer from "nodemailer"

type SmtpClientConfig = { hostname: string; smtpPort: number; }

type EmailMessage = {
    to: string;
    subject: string;
    text: string
}

export class BirthdayGreetings {

    async doTheStuff(smtpConfig: SmtpClientConfig) {
        await sendMail(smtpConfig, {
            to: "watcheenna@anotherworld.com", subject: "Happy Birthday", text: "Happy birthday, dear Conrad!"
        })
    }

}

export async function sendMail(smtpConfig: SmtpClientConfig, emailMessage: EmailMessage) {
    const smtpClient = nodemailer.createTransport({
        host: smtpConfig.hostname,
        port: smtpConfig.smtpPort,
        secure: false,
    })

    await smtpClient.sendMail({
        from: 'greetings@acme.com',
        to: emailMessage.to,
        subject: emailMessage.subject,
        text: emailMessage.text,
    })
}
