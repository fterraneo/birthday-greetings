import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { EOL } from "os"
import { SmtpClient, SmtpClientConfig } from "./smtp-client"

export type MailMessage = {
    from: string
    to: string
    subject: string
    text: string
}

export class BirthdayGreetings {
    private readonly smtpConfig: SmtpClientConfig
    private readonly filename: string
    private smtpClient: SmtpClient

    constructor(smtpConfig: SmtpClientConfig, filename: string) {
        this.smtpConfig = smtpConfig
        this.filename = filename
        this.smtpClient = new SmtpClient(this.smtpConfig)
    }

    async sendGreetings(today: Date) {
        const employeeLines = await readEmployeesCsv(this.filename)

        for (const employeeLine of employeeLines) {
            const employeeParts = employeeLine.split(",").map((part) => part.trim())
            if (!employeeParts[2]) throw new Error("invalid birth date!")
            const bornOn = new Date(employeeParts[2])

            if (this.isBirthDay(bornOn, today)) {
                const emailMessage: MailMessage = mailMessageFrom(employeeParts[3], employeeParts[1])
                await this.smtpClient.sendMail(emailMessage)
            }
        }
    }

    private isBirthDay(bornOn: Date, today: Date) {
        return today.getDate() === bornOn.getDate() && today.getMonth() === bornOn.getMonth()
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

export async function readEmployeesCsv(fileName: string) {
    if(!existsSync(fileName)) return []
    const buffer = await readFile(fileName)
    const content = buffer.toString()
    const allLines = content.split(EOL)
    const [, ...employeeLines] = allLines
    return employeeLines.filter((line) => line.length !== 0)
}
