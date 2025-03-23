import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { EOL } from "os"
import { SmtpClient, SmtpClientConfig } from "./smtp-client"
import { MailMessage, mailMessageFrom } from "./mail-message"
import { isBirthDay } from "./is-birthday"
import { Employee, employeeFrom } from "./employee"

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
        const employees = await loadAllEmployees(this.filename)

        for (const employee of employees) {
            if (isBirthDay(employee.bornOn, today)) {
                const emailMessage: MailMessage = mailMessageFrom(employee.emailAddress, employee.firstName)
                await this.smtpClient.sendMail(emailMessage)
            }
        }
    }
}

async function loadAllEmployees(filename: string) {
    const employeeLines = await readEmployeesCsv(filename)
    const employees: Employee[] = []

    for (const employeeLine of employeeLines) {
        const employee = parseEmployeeCsv(employeeLine)

        employees.push(employee)
    }
    return employees
}

function parseEmployeeCsv(employeeLine: string) {
    const employeeParts = employeeLine.split(",").map((part) => part.trim())
    return employeeFrom(
        employeeParts[1],
        employeeParts[0],
        employeeParts[2],
        employeeParts[3],
    )
}

export async function readEmployeesCsv(fileName: string) {
    if (!existsSync(fileName)) return []
    const buffer = await readFile(fileName)
    const content = buffer.toString()
    const allLines = content.split(EOL)
    const [, ...employeeLines] = allLines
    return employeeLines.filter((line) => line.length !== 0)
}
