import { ChildProcess, spawn } from "child_process"
import isPortReachable from "is-port-reachable"
import path from "path"
import { delay } from "./delay"
import mailhog from "mailhog"

export type SmtpServerConfig = {
    hostname: string
    smtpPort: number
    httpPort: number
}

export async function startSmtpServer(smtpConfig: SmtpServerConfig) {
    const file = path.join(__dirname, "./MailHog_darwin_amd64")
    const process = spawn(file, {
        env: {
            MH_SMTP_BIND_ADDR: `${smtpConfig.hostname}:${smtpConfig.smtpPort}`,
            MH_UI_BIND_ADDR: `${smtpConfig.hostname}:${smtpConfig.httpPort}`,
            MH_API_BIND_ADDR: `${smtpConfig.hostname}:${smtpConfig.httpPort}`,
        },
    }).on("error", (...args) => {
        console.error("cannot execute mailhog", args)
    })

    await isPortReachable(smtpConfig.smtpPort, { host: smtpConfig.hostname })
    await delay(100)

    return process
}

export function stopSmtpServer(process: ChildProcess) {
    process.kill()
}

export async function deliveredMessage(smtpConfig: SmtpServerConfig) {
    const api = mailhog({ host: smtpConfig.hostname, port: smtpConfig.httpPort })

    return await api.messages()
}

