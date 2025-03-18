import { test, expect, beforeEach, afterEach } from "@jest/globals"
import { LocalSmtpServer } from "./support/local-smtp-server"
import { sendMail } from "./birthday-greetings"

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

test("send mail", async () => {
    await sendMail(smtpConfig)

    const messages = await localSmtpServer.deliveredMessages()
    expect(messages?.count).toBe(1)
})

