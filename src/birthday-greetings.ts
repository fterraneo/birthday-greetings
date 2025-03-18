import nodemailer from "nodemailer"

type SmtpClientConfig = { hostname: string; smtpPort: number; }

export async function sendMail(smtpConfig: SmtpClientConfig) {
    const smtpClient = nodemailer.createTransport({
        host: smtpConfig.hostname,
        port: smtpConfig.smtpPort,
        secure: false,
    })

    await smtpClient.sendMail({
        from: "greetings@acme.com",
        to: "john.doe@acme.com",
        subject: "BOH",
        text: "Is this real?",
    })
}
