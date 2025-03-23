import { existsSync, unlinkSync, writeFileSync } from "fs"
import { EOL } from "os"

export function prepareEmployeesCsv(fileName: string, data: string[]) {
    const header = "last_name, first_name, date_of_birth, email"
    const allData = [header].concat(data).join(EOL)
    writeFileSync(fileName, allData)
}

export function deleteFile(filename: string) {
    existsSync(filename) && unlinkSync(filename)
}
