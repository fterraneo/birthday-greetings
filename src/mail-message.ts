export type MailMessage = {
    from: string
    to: string
    subject: string
    text: string
}

export function mailMessageFrom(emailAddress: string, firstName: string): MailMessage {
    return {
        from: "greetings@acme.com",
        to: emailAddress,
        subject: "Happy Birthday",
        text: `Happy birthday, dear ${firstName}!`,
    }
}
