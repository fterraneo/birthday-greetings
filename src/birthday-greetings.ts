import { SmtpPostalOffice, SmtpClientConfig } from "./smtp-postal-office"
import { MailMessage, mailMessageFrom } from "./mail-message"
import { isBirthDay } from "./is-birthday"
import { CsvEmployeeCatalog } from "./csv-employee-catalog"

export class BirthdayGreetings {
    private readonly smtpConfig: SmtpClientConfig
    private smtpPostalOffice: SmtpPostalOffice
    private csvEmployeeCatalog: CsvEmployeeCatalog

    constructor(smtpConfig: SmtpClientConfig, csvEmployeeCatalog: CsvEmployeeCatalog) {
        this.smtpConfig = smtpConfig
        this.smtpPostalOffice = new SmtpPostalOffice(this.smtpConfig)
        this.csvEmployeeCatalog = csvEmployeeCatalog
    }

    async sendGreetings(today: Date) {
        const employees = await this.csvEmployeeCatalog.loadAll()

        for (const employee of employees) {
            if (isBirthDay(employee.bornOn, today)) {
                const emailMessage: MailMessage = mailMessageFrom(employee.emailAddress, employee.firstName)
                await this.smtpPostalOffice.sendMail(emailMessage)
            }
        }
    }
}
