import { BirthdayGreetings } from "./birthday-greetings"
import { SmtpClientConfig, SmtpPostalOffice } from "./smtp-postal-office"
import { CsvEmployeeCatalog } from "./csv-employee-catalog"

const smtpClientConfig: SmtpClientConfig = {
    hostname: "0.0.0.0",
    smtpPort: 1025,
}
const filename = "testfiles/employees-demo.csv"

const app = new BirthdayGreetings(new CsvEmployeeCatalog(filename), new SmtpPostalOffice(smtpClientConfig))

app.sendGreetings(new Date("2025-03-28"))
    .then(() => console.info("greetings sent!"))
    .catch((error) => console.error("cannot sent greetings: ", error))
