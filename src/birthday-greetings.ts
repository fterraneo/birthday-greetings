import { MailMessage, mailMessageFrom } from "./mail-message"
import { isBirthDay } from "./is-birthday"
import { CsvEmployeeCatalog } from "./csv-employee-catalog"

export class BirthdayGreetings {
    private postalOffice: PostalOffice
    private csvEmployeeCatalog: CsvEmployeeCatalog

    constructor(csvEmployeeCatalog: CsvEmployeeCatalog, postalOffice: PostalOffice) {
        this.postalOffice = postalOffice
        this.csvEmployeeCatalog = csvEmployeeCatalog
    }

    async sendGreetings(today: Date) {
        const employees = await this.csvEmployeeCatalog.loadAll()

        for (const employee of employees) {
            if (isBirthDay(employee.bornOn, today)) {
                const emailMessage: MailMessage = mailMessageFrom(employee.emailAddress, employee.firstName)
                await this.postalOffice.sendMail(emailMessage)
            }
        }
    }
}

export interface PostalOffice {
    sendMail(mailMessage: MailMessage): Promise<void>
}
