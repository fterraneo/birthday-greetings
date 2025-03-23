import { expect, test } from "@jest/globals"
import { mailMessageFrom } from "./mail-message"

test("should create greetings email message starting from recipient email and first name", () => {
    const mailMessage = mailMessageFrom("sberla@ateam.com", "Sberla")

    expect(mailMessage).toMatchObject({
        from: "greetings@acme.com",
        to: "sberla@ateam.com",
        subject: "Happy Birthday",
        text: "Happy birthday, dear Sberla!",
    })
})
