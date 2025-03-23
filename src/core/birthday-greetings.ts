import { MailMessage, mailMessageFrom } from "./mail-message"
import { isBirthDay } from "./is-birthday"
import { Employee } from "./employee"

export interface EmployeeCatalog {
    loadAll(): Promise<Employee[]>
}

export interface PostalOffice {
    sendMail(mailMessage: MailMessage): Promise<void>
}

export class BirthdayGreetings {
    private postalOffice: PostalOffice
    private employeeCatalog: EmployeeCatalog

    constructor(employeeCatalog: EmployeeCatalog, postalOffice: PostalOffice) {
        this.postalOffice = postalOffice
        this.employeeCatalog = employeeCatalog
    }

    async sendGreetings(today: Date) {
        const employees = await this.employeeCatalog.loadAll()

        for (const employee of employees) {
            if (isBirthDay(employee.bornOn, today)) {
                const emailMessage: MailMessage = mailMessageFrom(employee.emailAddress, employee.firstName)
                await this.postalOffice.sendMail(emailMessage)
            }
        }
    }
}
