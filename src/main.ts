import { startSmtpServer } from "./support/local-smtp-server"

console.log("Hello world!")

const proc = startSmtpServer({
    hostname: "0.0.0.0",
    smtpPort: 1025,
    httpPort: 8025
})
