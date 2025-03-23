import { afterEach, beforeEach, expect, test } from "@jest/globals"
import { SmtpPostalOffice } from "./smtp-postal-office"
import { LocalSmtpServer } from "../support/local-smtp-server"

const smtpConfig = {
    hostname: "0.0.0.0",
    smtpPort: 1027,
    httpPort: 8027,
}
const localSmtpServer = new LocalSmtpServer(smtpConfig)

beforeEach(async () => {
    await localSmtpServer.start()
})

afterEach(() => {
    localSmtpServer.stop()
})

test("one match", async () => {
    const smtpClient = new SmtpPostalOffice(smtpConfig)
    await smtpClient.sendMail({
        from: "sendemailtest@acme.com",
        to: "john.doe@acme.com",
        subject: "BOH",
        text: "Is this real?",
    })

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(1)
})

test("many matches", async () => {
    const smtpClient = new SmtpPostalOffice(smtpConfig)
    const message = {
        from: "sendemailtest@acme.com",
        to: "one@acme.com",
        subject: "Many Matches",
        text: "Is this real?",
    }

    await smtpClient.sendMail(message)
    await smtpClient.sendMail({ ...message, to: "two@acme.com"})
    await smtpClient.sendMail({ ...message, to: "three@acme.com"})

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(3)
})

test("smtp unreachable", async () => {
    localSmtpServer.stop()

    const smtpClient = new SmtpPostalOffice(smtpConfig)
    const message = {
        from: "sendemailtest@acme.com",
        to: "john.doe@acme.com",
        subject: "BOH",
        text: "Is this real?",
    }

    await expect(smtpClient.sendMail(message)).rejects.toThrow("SMTP unreachable")
})
