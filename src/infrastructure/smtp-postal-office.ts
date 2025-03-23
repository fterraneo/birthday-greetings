import nodemailer from "nodemailer"
import { MailMessage } from "../core/mail-message"
import { PostalOffice } from "../core/birthday-greetings"

export type SmtpClientConfig = { hostname: string; smtpPort: number; }

export class SmtpPostalOffice implements PostalOffice {
    private config: SmtpClientConfig

    constructor(config: SmtpClientConfig) {
        this.config = config
    }

    async sendMail(mailMessage: MailMessage) {
        try {
            const smtpClient = nodemailer.createTransport({
                host: this.config.hostname,
                port: this.config.smtpPort,
                secure: false,
            })

            await smtpClient.sendMail({
                from: mailMessage.from,
                to: mailMessage.to,
                subject: mailMessage.subject,
                text: mailMessage.text,
            })
        } catch (error) {
            throw new Error("SMTP unreachable")
        }
    }
}
