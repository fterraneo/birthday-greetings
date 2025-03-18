import { test } from "@jest/globals"
import { startSmtpServer, stopSmtpServer } from "./support/local-smtp-server"
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
    } finally {
        stopSmtpServer(proc)
    }

})

