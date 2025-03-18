import { test, expect } from "@jest/globals"
import { deliveredMessage, startSmtpServer, stopSmtpServer } from "./support/local-smtp-server"
import { sendMail } from "./birthday-greetings"

test("send mail", async () => {
    const smtpConfig = {
        hostname: "0.0.0.0",
        smtpPort: 1025,
        httpPort: 8025,
    }
    const proc = await startSmtpServer(smtpConfig)

    try {
        await sendMail(smtpConfig)

        const messages = await deliveredMessage(smtpConfig)

        expect(messages?.count).toBe(1)
    } finally {
        stopSmtpServer(proc)
    }

})

