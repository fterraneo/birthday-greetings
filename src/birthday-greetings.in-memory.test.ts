import { afterEach, beforeEach, expect, test } from "@jest/globals"
import { BirthdayGreetings, EmployeeCatalog } from "./core/birthday-greetings"
import { LocalSmtpServer } from "./support/local-smtp-server"
import { arrayContains } from "./support/custom-asserts"
import { mailMessageFrom } from "./core/mail-message"
import { SmtpPostalOffice } from "./infrastructure/smtp-postal-office"
import { Employee, employeeFrom } from "./core/employee"

const smtpConfig = {
    hostname: "0.0.0.0",
    smtpPort: 1028,
    httpPort: 8028,
}

const localSmtpServer = new LocalSmtpServer(smtpConfig)

beforeEach(async () => {
    await localSmtpServer.start()
})

afterEach(() => {
    localSmtpServer.stop()
})

class InMemoryEmployeeCatalog implements EmployeeCatalog {
    private readonly employees: Employee[]

    constructor(employees: Employee[]) {
        this.employees = employees
    }

    loadAll(): Promise<Employee[]> {
        return Promise.resolve(this.employees)
    }
}

test("no match", async () => {
    const employeeCatalog: EmployeeCatalog = new InMemoryEmployeeCatalog([
        employeeFrom("David", "Braben", "1964-01-02", "dave@frontier.com"),
        employeeFrom("Eric", "Chahi", "1967-10-21", "eric@anotherworld.com"),
        employeeFrom("Ron", "Gilbert", "1964-01-01", "ronnie@melee.com"),
    ])

    const app = new BirthdayGreetings(employeeCatalog, new SmtpPostalOffice(smtpConfig))

    await app.sendGreetings(new Date("2025-03-19"))

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(0)
})

test("one match", async () => {
    const employeeCatalog: EmployeeCatalog = new InMemoryEmployeeCatalog([
        employeeFrom("David", "Braben", "1964-01-02", "dave@frontier.com"),
        employeeFrom("Eric", "Chahi", "1967-10-21", "eric@anotherworld.com"),
        employeeFrom("Ron", "Gilbert", "1964-01-01", "ronnie@melee.com"),
    ])

    const app = new BirthdayGreetings(employeeCatalog, new SmtpPostalOffice(smtpConfig))

    await app.sendGreetings(new Date("2024-01-01"))

    const messages = await localSmtpServer.deliveredMessages()
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

    const app = new BirthdayGreetings(employeeCatalog, new SmtpPostalOffice(smtpConfig))

    await app.sendGreetings(new Date("2026-10-21"))

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(2)
    expect(messages?.items).toEqual(arrayContains(mailMessageFrom("eric@anotherworld.com", "Eric")))
    expect(messages?.items).toEqual(arrayContains(mailMessageFrom("ale@sforza.it", "Alessandro")))
})
