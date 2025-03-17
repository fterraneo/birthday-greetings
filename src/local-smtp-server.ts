import { ChildProcess, spawn } from "child_process"
import isPortReachable from "is-port-reachable"
import path from "path"
import { delay } from "./delay"

export async function startSmtpServer() {
    const file = path.join(__dirname, "./MailHog_darwin_amd64")
    const proc = spawn(file).on("error", (...args) => {
        console.error("cannot execute mailhog", args)
    })

    await isPortReachable(1025, { host: "0.0.0.0" })
    await delay(100)

    return proc
}

export function stopSmtpServer(process: ChildProcess) {
    process.kill()
}

