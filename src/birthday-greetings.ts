import { readFile } from "fs/promises"
import nodemailer from "nodemailer"
import { EOL } from "os"

type SmtpClientConfig = { hostname: string; smtpPort: number; }

type EmailMessage = {
    to: string;
    subject: string;
    text: string
}

export class BirthdayGreetings {

    async sendGreetings(smtpConfig: SmtpClientConfig, fileName: string) {
        const employeeLines = await readEmployeesCsv(fileName)

        const ronLine = employeeLines[2]
        if (!ronLine) throw new Error("where is Ron Gilbert???")
        const ronParts = ronLine.split(",")

        const emailMessage = {
            to: ronParts[3] ?? "", subject: "Happy Birthday", text: `Happy birthday, dear ${ronParts[0]}!`,
        }

        await sendMail(smtpConfig, emailMessage)
    }

}

export async function sendMail(smtpConfig: SmtpClientConfig, emailMessage: EmailMessage) {
    const smtpClient = nodemailer.createTransport({
        host: smtpConfig.hostname,
        port: smtpConfig.smtpPort,
        secure: false,
    })

    await smtpClient.sendMail({
        from: "greetings@acme.com",
        to: emailMessage.to,
        subject: emailMessage.subject,
        text: emailMessage.text,
    })
}

export async function readEmployeesCsv(fileName: string) {
    const buffer = await readFile(fileName)
    const content = buffer.toString()
    const allLines = content.split(EOL)
    const [, ...employeeLines] = allLines
    return employeeLines
}
