import { test } from "@jest/globals"
import nodemailer from "nodemailer"

test("send mail", async () => {
    await sendMail({
        host: "0.0.0.0",
        port: 1025,
    })
})

type SmtpConfig = { port: number; host: string }

async function sendMail(smtpConfig: SmtpConfig) {
    const smtpClient = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: false,
    })

    await smtpClient.sendMail({
        from: "greetings@acme.com",
        to: "john.doe@acme.com",
        subject: "BOH",
        text: "Is this real?",
    })
}

