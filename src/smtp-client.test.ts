import { afterEach, beforeEach, expect, test } from "@jest/globals"
import { SmtpClient } from "./smtp-client"
import { LocalSmtpServer } from "./support/local-smtp-server"

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

test("send mail", async () => {
    const smtpClient = new SmtpClient(smtpConfig)
    await smtpClient.sendMail({
        from: "sendemailtest@acme.com",
        to: "john.doe@acme.com",
        subject: "BOH",
        text: "Is this real?",
    })

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(1)
})

test("smtp unreachable", async () => {
    localSmtpServer.stop()

    const smtpClient = new SmtpClient(smtpConfig)
    const message = {
        from: "sendemailtest@acme.com",
        to: "john.doe@acme.com",
        subject: "BOH",
        text: "Is this real?",
    }

    await expect(smtpClient.sendMail(message)).rejects.toThrow("SMTP unreachable")
})
