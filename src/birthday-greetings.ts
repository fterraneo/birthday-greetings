import { SmtpPostalOffice, SmtpClientConfig } from "./smtp-postal-office"
import { MailMessage, mailMessageFrom } from "./mail-message"
import { isBirthDay } from "./is-birthday"
import { CsvEmployeeCatalog } from "./csv-employee-catalog"

export class BirthdayGreetings {
    private readonly smtpConfig: SmtpClientConfig
    private readonly filename: string
    private smtpPostalOffice: SmtpPostalOffice

    constructor(smtpConfig: SmtpClientConfig, filename: string) {
        this.smtpConfig = smtpConfig
        this.filename = filename
        this.smtpPostalOffice = new SmtpPostalOffice(this.smtpConfig)
    }

    async sendGreetings(today: Date) {
        const employeeCatalog = new CsvEmployeeCatalog(this.filename)
        const employees = await employeeCatalog.loadAll()

        for (const employee of employees) {
            if (isBirthDay(employee.bornOn, today)) {
                const emailMessage: MailMessage = mailMessageFrom(employee.emailAddress, employee.firstName)
                await this.smtpPostalOffice.sendMail(emailMessage)
            }
        }
    }
}
