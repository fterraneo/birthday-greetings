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

export class LocalSmtpServer {
    private readonly config: SmtpServerConfig
    private smtpProcess: ChildProcess | undefined

    constructor(config: SmtpServerConfig) {
        this.config = config
    }

    async start() {
        this.smtpProcess = await startSmtpServer(this.config)
    }

    stop() {
        this.smtpProcess?.kill()
    }

    async deliveredMessages() {
        const api = mailhog({ host: this.config.hostname, port: this.config.httpPort })
        return await api.messages()
    }
}

async function startSmtpServer(smtpConfig: SmtpServerConfig): Promise<ChildProcess> {
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

