import { BirthdayGreetings, SmtpClientConfig } from "./birthday-greetings"

const smtpClientConfig: SmtpClientConfig = {
    hostname: "0.0.0.0",
    smtpPort: 1027,
}

const filename = "testfiles/employees-demo.csv"
const app = new BirthdayGreetings(smtpClientConfig, filename)

app.sendGreetings(new Date("2025-03-28"))
    .then(() => console.info("greetings sent!"))
    .catch((error) => console.error("cannot sent greetings: ", error))
