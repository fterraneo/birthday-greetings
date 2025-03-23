import { expect, test } from "@jest/globals"
import { BirthdayGreetings, EmployeeCatalog, PostalOffice } from "./core/birthday-greetings"
import { arrayContains } from "./support/custom-asserts"
import { MailMessage, mailMessageFrom } from "./core/mail-message"
import { Employee, employeeFrom } from "./core/employee"

class InMemoryEmployeeCatalog implements EmployeeCatalog {
    private readonly employees: Employee[]

    constructor(employees: Employee[]) {
        this.employees = employees
    }

    loadAll(): Promise<Employee[]> {
        return Promise.resolve(this.employees)
    }
}

class InMemoryPostalOffice implements PostalOffice {
    private readonly sentMessages: MailMessage[]

    constructor() {
        this.sentMessages = []
    }

    sendMail(mailMessage: MailMessage): Promise<void> {
        this.sentMessages.push(mailMessage)
        return Promise.resolve(undefined)
    }

    deliveredMessages() {
        return {
            count: this.sentMessages.length,
            items: [...this.sentMessages],
        }
    }
}

test("no match", async () => {
    const employeeCatalog: EmployeeCatalog = new InMemoryEmployeeCatalog([
        employeeFrom("David", "Braben", "1964-01-02", "dave@frontier.com"),
        employeeFrom("Eric", "Chahi", "1967-10-21", "eric@anotherworld.com"),
        employeeFrom("Ron", "Gilbert", "1964-01-01", "ronnie@melee.com"),
    ])
    const postalOffice = new InMemoryPostalOffice()
    const app = new BirthdayGreetings(employeeCatalog, postalOffice)

    await app.sendGreetings(new Date("2025-03-19"))

    const messages = postalOffice.deliveredMessages()
    expect(messages?.count).toBe(0)
})

test("one match", async () => {
    const employeeCatalog: EmployeeCatalog = new InMemoryEmployeeCatalog([
        employeeFrom("David", "Braben", "1964-01-02", "dave@frontier.com"),
        employeeFrom("Eric", "Chahi", "1967-10-21", "eric@anotherworld.com"),
        employeeFrom("Ron", "Gilbert", "1964-01-01", "ronnie@melee.com"),
    ])
    const postalOffice = new InMemoryPostalOffice()
    const app = new BirthdayGreetings(employeeCatalog, postalOffice)

    await app.sendGreetings(new Date("2024-01-01"))

    const messages = postalOffice.deliveredMessages()
    expect(messages?.count).toBe(1)
    expect(messages?.items).toEqual(arrayContains(mailMessageFrom("ronnie@melee.com", "Ron")))
})

test("many matches", async () => {
    const employeeCatalog: EmployeeCatalog = new InMemoryEmployeeCatalog([
        employeeFrom("David", "Braben", "1964-01-02", "dave@frontier.com"),
        employeeFrom("Eric", "Chahi", "1967-10-21", "eric@anotherworld.com"),
        employeeFrom("Ron", "Gilbert", "1964-01-01", "ronnie@melee.com"),
        employeeFrom("Alessandro", "Sforza", "1409-10-21", "ale@sforza.it"),
    ])
    const postalOffice = new InMemoryPostalOffice()
    const app = new BirthdayGreetings(employeeCatalog, postalOffice)

    await app.sendGreetings(new Date("2026-10-21"))

    const messages = postalOffice.deliveredMessages()
    expect(messages?.count).toBe(2)
    expect(messages?.items).toEqual(arrayContains(mailMessageFrom("eric@anotherworld.com", "Eric")))
    expect(messages?.items).toEqual(arrayContains(mailMessageFrom("ale@sforza.it", "Alessandro")))
})
