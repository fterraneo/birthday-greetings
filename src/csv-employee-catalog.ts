import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { EOL } from "os"
import { Employee, employeeFrom } from "./employee"
import { EmployeeCatalog } from "./birthday-greetings"

export class CsvEmployeeCatalog implements EmployeeCatalog{
    private readonly fileName: string

    constructor(fileName: string) {
        this.fileName = fileName
    }

    async loadAll(): Promise<Employee[]> {
        const employeeLines = await this.readEmployeesCsv(this.fileName)
        const employees: Employee[] = []

        for (const employeeLine of employeeLines) {
            const employee = this.parseEmployeeCsv(employeeLine)

            employees.push(employee)
        }
        return employees
    }

    private parseEmployeeCsv(employeeLine: string) {
        const employeeParts = employeeLine.split(",").map((part) => part.trim())
        return employeeFrom(
            employeeParts[1],
            employeeParts[0],
            employeeParts[2],
            employeeParts[3],
        )
    }

    private async readEmployeesCsv(fileName: string) {
        if (!existsSync(fileName)) return []
        const buffer = await readFile(fileName)
        const content = buffer.toString()
        const allLines = content.split(EOL)
        const [, ...employeeLines] = allLines
        return employeeLines.filter((line) => line.length !== 0)
    }
}
