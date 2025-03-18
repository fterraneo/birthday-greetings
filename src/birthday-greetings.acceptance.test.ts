import { afterEach, beforeEach, expect, test } from "@jest/globals"
import { LocalSmtpServer } from "./support/local-smtp-server"
import { BirthdayGreetings, readEmployeesCsv, sendMail } from "./birthday-greetings"
import { EOL } from "os"
import { writeFileSync } from "fs"

const smtpConfig = {
    hostname: "0.0.0.0",
    smtpPort: 1025,
    httpPort: 8025,
}

const localSmtpServer = new LocalSmtpServer(smtpConfig)

beforeEach(async () => {
    await localSmtpServer.start()
})

afterEach(() => {
    localSmtpServer.stop()
})

test("one match", async () => {
    const data = [
        "David, Braben, 1964-01-02, dave@frontier.com",
        "Eric, Chahi, 1967-10-21, eric@anotherworld.com",
        "Ron, Gilbert, 1964-01-01, ronnie@melee.com"
    ]
    const fileName = "testfiles/employees-one-match.test.csv"
    prepareEmployeesCsv(fileName, data)

    const app = new BirthdayGreetings()
    await app.sendGreetings(smtpConfig, fileName)

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(1)
    expect(messages?.items[0]).toMatchObject({
        from: "greetings@acme.com",
        to: "ronnie@melee.com",
        subject: "Happy Birthday",
        text: "Happy birthday, dear Ron!",
    })
})

test("send mail", async () => {
    await sendMail(smtpConfig, { to: "john.doe@acme.com", subject: "BOH", text: "Is this real?" })

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(1)
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

