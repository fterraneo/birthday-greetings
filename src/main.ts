import { LocalSmtpServer } from "./support/local-smtp-server"

console.log("starting local smtp server ...")

const localSmtpServer = new LocalSmtpServer({
    hostname: "0.0.0.0",
    smtpPort: 1025,
    httpPort: 8025,
})
localSmtpServer.start()
    .then(() => console.log("local smtp server up and running!"))
    .catch(() => console.error("cannot start local smtp server"))
