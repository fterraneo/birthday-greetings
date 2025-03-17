import { spawn } from "child_process"
import path from "path"

console.log("Hello world!")

const file = path.join(__dirname, "./MailHog_darwin_amd64")
const proc = spawn(file).on("error", (...args) => console.error("cannot execute mailhog", args))



