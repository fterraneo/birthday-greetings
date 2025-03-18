import nodemailer from "nodemailer"

type SmtpClientConfig = { hostname: string; smtpPort: number; }

type EmailMessage = {
    subject: string;
    to: string;
    text: string
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
