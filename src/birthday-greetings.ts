import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { EOL } from "os"
import { SmtpClient, SmtpClientConfig } from "./smtp-client"
import { MailMessage, mailMessageFrom } from "./mail-message"
import { isBirthDay } from "./is-birthday"

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

            if (isBirthDay(bornOn, today)) {
                const emailMessage: MailMessage = mailMessageFrom(employeeParts[3], employeeParts[1])
                await this.smtpClient.sendMail(emailMessage)
            }
        }
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
