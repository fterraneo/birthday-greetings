import { SmtpClient, SmtpClientConfig } from "./smtp-client"
import { MailMessage, mailMessageFrom } from "./mail-message"
import { isBirthDay } from "./is-birthday"
import { CsvEmployeeCatalog } from "./csv-employee-catalog"

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
        const employeeCatalog = new CsvEmployeeCatalog(this.filename)
        const employees = await employeeCatalog.loadAll()

        for (const employee of employees) {
            if (isBirthDay(employee.bornOn, today)) {
                const emailMessage: MailMessage = mailMessageFrom(employee.emailAddress, employee.firstName)
                await this.smtpClient.sendMail(emailMessage)
            }
        }
    }
}
