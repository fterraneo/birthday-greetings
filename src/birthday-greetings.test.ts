import { test, expect, beforeEach, afterEach } from "@jest/globals"
import { deliveredMessage, startSmtpServer, stopSmtpServer } from "./support/local-smtp-server"
import { sendMail } from "./birthday-greetings"
import { ChildProcess } from "child_process"

const smtpConfig = {
    hostname: "0.0.0.0",
    smtpPort: 1025,
    httpPort: 8025,
}

let localSmtpProcess: ChildProcess | undefined = undefined

beforeEach(async () => {
    localSmtpProcess = await startSmtpServer(smtpConfig)
})

afterEach(() => {
    stopSmtpServer(localSmtpProcess)
})

test("send mail", async () => {
    await sendMail(smtpConfig)

    const messages = await deliveredMessage(smtpConfig)
    expect(messages?.count).toBe(1)
})

