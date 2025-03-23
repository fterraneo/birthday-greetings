import { SmtpPostalOffice } from "./smtp-postal-office"
import { MailMessage, mailMessageFrom } from "./mail-message"
import { isBirthDay } from "./is-birthday"
import { CsvEmployeeCatalog } from "./csv-employee-catalog"

export class BirthdayGreetings {
    private smtpPostalOffice: SmtpPostalOffice
    private csvEmployeeCatalog: CsvEmployeeCatalog

    constructor(csvEmployeeCatalog: CsvEmployeeCatalog, smtpPostalOffice: SmtpPostalOffice) {
        this.smtpPostalOffice = smtpPostalOffice
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
