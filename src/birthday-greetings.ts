import { readFile } from "fs/promises"
import nodemailer from "nodemailer"
import { EOL } from "os"

type SmtpClientConfig = { hostname: string; smtpPort: number; }

export type MailMessage = {
    from: string
    to: string
    subject: string
    text: string
}

export class BirthdayGreetings {

    async sendGreetings(smtpConfig: SmtpClientConfig, fileName: string) {
        const employeeLines = await readEmployeesCsv(fileName)

        const ronLine = employeeLines[2]
        if (!ronLine) throw new Error("where is Ron Gilbert???")
        const ronParts = ronLine.split(",")

        const emailMessage: MailMessage = mailMessageFrom(ronParts[3], ronParts[0])

        await sendMail(smtpConfig, emailMessage)
    }

}

export function mailMessageFrom(emailAddress: string | undefined, firstName: string | undefined): MailMessage {
    if (!emailAddress) throw new Error("invalid mail address!")
    if (!firstName) throw new Error("invalid first name!")

    return {
        from: "greetings@acme.com",
        to: emailAddress,
        subject: "Happy Birthday",
        text: `Happy birthday, dear ${firstName}!`,
    }
}

export async function sendMail(smtpConfig: SmtpClientConfig, mailMessage: MailMessage) {
    const smtpClient = nodemailer.createTransport({
        host: smtpConfig.hostname,
        port: smtpConfig.smtpPort,
        secure: false,
    })

    await smtpClient.sendMail({
        from: mailMessage.from,
        to: mailMessage.to,
        subject: mailMessage.subject,
        text: mailMessage.text,
    })
}

export async function readEmployeesCsv(fileName: string) {
    const buffer = await readFile(fileName)
    const content = buffer.toString()
    const allLines = content.split(EOL)
    const [, ...employeeLines] = allLines
    return employeeLines
}
