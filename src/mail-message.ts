export type MailMessage = {
    from: string
    to: string
    subject: string
    text: string
}

export function mailMessageFrom(emailAddress: string | undefined, firstName: string | undefined): MailMessage {
    if (!emailAddress) throw new Error("invalid mail address!")
    if (!firstName) throw new Error("invalid first name!")

    return {
        from: "greetings@acme.com",
        to: emailAddress,
        subject: "Happy Birthday",
        text: `Happy birthday, dear ${firstName}!`,
    }
}
