import { afterEach, expect, test } from "@jest/globals"
import { CsvEmployeeCatalog } from "./csv-employee-catalog"
import { employeeFrom } from "./employee"
import { deleteFile, prepareEmployeesCsv } from "./support/test-helpers"

const fileName = "testfiles/employees.test.csv"

afterEach(() => {
    deleteFile(fileName)
})

test("one line", async () => {
    const data = ["Toothrot, Herman, 1960-07-01, h.t.marley@monkey.com"]
    prepareEmployeesCsv(fileName, data)

    const catalog = new CsvEmployeeCatalog(fileName)
    const employees = await catalog.loadAll()

    expect(employees).toContainEqual(employeeFrom("Herman", "Toothrot", "1960-07-01", "h.t.marley@monkey.com"))
})

test("many lines", async () => {
    const data = [
        "Toothrot, Herman, 1960-07-01, h.t.marley@monkey.com",
        "Threepwood, Guybrush, 1981-11-01, guy@monkey.com",
        "Marley, Elaine, 1980-07-18, elaine@monkey.com"
    ]
    prepareEmployeesCsv(fileName, data)

    const catalog = new CsvEmployeeCatalog(fileName)
    const employees = await catalog.loadAll()

    expect(employees.length).toBe(3)
    expect(employees).toContainEqual(employeeFrom("Herman", "Toothrot", "1960-07-01", "h.t.marley@monkey.com"))
    expect(employees).toContainEqual(employeeFrom("Guybrush", "Threepwood", "1981-11-01", "guy@monkey.com"))
    expect(employees).toContainEqual(employeeFrom("Elaine", "Marley", "1980-07-18", "elaine@monkey.com"))
})

test("no lines", async () => {
    const data = []
    prepareEmployeesCsv(fileName, data)

    const catalog = new CsvEmployeeCatalog(fileName)
    const employees = await catalog.loadAll()

    expect(employees.length).toBe(0)
})

test("empty file", async () => {
    const catalog = new CsvEmployeeCatalog("non-existing-file")
    const employees = await catalog.loadAll()

    expect(employees.length).toBe(0)
})
