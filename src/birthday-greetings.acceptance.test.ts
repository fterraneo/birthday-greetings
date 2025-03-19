import { afterEach, beforeEach, expect, test } from "@jest/globals"
import { LocalSmtpServer } from "./support/local-smtp-server"
import { BirthdayGreetings, mailMessageFrom, readEmployeesCsv } from "./birthday-greetings"
import { EOL } from "os"
import { existsSync, unlinkSync, writeFileSync } from "fs"
import { arrayContains } from "./support/custom-asserts"

const smtpConfig = {
    hostname: "0.0.0.0",
    smtpPort: 1026,
    httpPort: 8026,
}

const localSmtpServer = new LocalSmtpServer(smtpConfig)
const testFilename = "testfiles/employees.test.csv"

beforeEach(async () => {
    await localSmtpServer.start()
})

afterEach(() => {
    localSmtpServer.stop()
    deleteFile(testFilename)
})

test("no match", async () => {
    const today = new Date("2025-03-19")
    const data = [
        "Braben, David, 1964-01-02, dave@frontier.com",
        "Chahi, Eric, 1967-10-21, eric@anotherworld.com",
        "Gilbert, Ron, 1964-01-01, ronnie@melee.com",
    ]
    prepareEmployeesCsv(testFilename, data)
    const app = new BirthdayGreetings(smtpConfig, testFilename)

    await app.sendGreetings(today)

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(0)
})

test("one match", async () => {
    const today = new Date("2024-01-01")
    const data = [
        "Braben, David, 1964-01-02, dave@frontier.com",
        "Chahi, Eric, 1967-10-21, eric@anotherworld.com",
        "Gilbert, Ron, 1964-01-01, ronnie@melee.com",
    ]
    prepareEmployeesCsv(testFilename, data)
    const app = new BirthdayGreetings(smtpConfig, testFilename)

    await app.sendGreetings(today)

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(1)
    expect(messages?.items).toEqual(arrayContains(mailMessageFrom("ronnie@melee.com", "Ron")))
})

test("many matches", async () => {
    const today = new Date("2026-10-21")
    const data = [
        "Braben, David, 1964-01-02, dave@frontier.com",
        "Chahi, Eric, 1967-10-21, eric@anotherworld.com",
        "Gilbert, Ron, 1964-01-01, ronnie@melee.com",
        "Sforza, Alessandro, 1409-10-21, ale@sforza.it",
    ]
    prepareEmployeesCsv(testFilename, data)
    const app = new BirthdayGreetings(smtpConfig, testFilename)

    await app.sendGreetings(today)

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(2)
    expect(messages?.items).toEqual(arrayContains(mailMessageFrom("eric@anotherworld.com", "Eric")))
    expect(messages?.items).toEqual(arrayContains(mailMessageFrom("ale@sforza.it", "Alessandro")))
})

test("smtp unreachable", async () => {
    localSmtpServer.stop()

    const today = new Date("2024-01-01")
    const data = [
        "Braben, David, 1964-01-02, dave@frontier.com",
        "Chahi, Eric, 1967-10-21, eric@anotherworld.com",
        "Gilbert, Ron, 1964-01-01, ronnie@melee.com",
    ]
    prepareEmployeesCsv(testFilename, data)
    const app = new BirthdayGreetings(smtpConfig, testFilename)

    await expect(app.sendGreetings(today)).rejects.toThrow("SMTP unreachable")
})

test("empty file", async () => {
    const today = new Date("2024-01-01")
    const app = new BirthdayGreetings(smtpConfig, "non-existing-file")

    await app.sendGreetings(today)

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(0)
})

test("ignore empty line", async () => {
    const today = new Date("2024-01-01")
    const data = [
        "Braben, David, 1964-01-02, dave@frontier.com",
        "Chahi, Eric, 1967-10-21, eric@anotherworld.com",
        "Gilbert, Ron, 1964-01-01, ronnie@melee.com",
        ""
    ]
    prepareEmployeesCsv(testFilename, data)
    const app = new BirthdayGreetings(smtpConfig, testFilename)

    await app.sendGreetings(today)

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(1)
})

test("should create greetings email message starting from recipient email and first name", () => {
    const mailMessage = mailMessageFrom("sberla@ateam.com", "Sberla")

    expect(mailMessage).toMatchObject({
        from: "greetings@acme.com",
        to: "sberla@ateam.com",
        subject: "Happy Birthday",
        text: "Happy birthday, dear Sberla!",
    })
})

test("read employees csv file", async () => {
    const data = ["Herman, Toothrot, 1960-07-01, h.t.marley@monkey.com"]
    const fileName = "testfiles/employees.test.csv"
    prepareEmployeesCsv(fileName, data)

    const content = await readEmployeesCsv(fileName)

    expect(content).toEqual(data)
})

function prepareEmployeesCsv(fileName: string, data: string[]) {
    const header = "last_name, first_name, date_of_birth, email"
    const allData = [header].concat(data).join(EOL)
    writeFileSync(fileName, allData)
}

function deleteFile(filename: string) {
    existsSync(filename) && unlinkSync(filename)
}
