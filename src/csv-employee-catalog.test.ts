import { afterEach, expect, test } from "@jest/globals"
import { CsvEmployeeCatalog } from "./csv-employee-catalog"
import { employeeFrom } from "./employee"
import { deleteFile, prepareEmployeesCsv } from "./support/test-helpers"

const fileName = "testfiles/employees.test.csv"

afterEach(() => {
    deleteFile(fileName)
})

test("one match", async () => {
    const data = ["Toothrot, Herman, 1960-07-01, h.t.marley@monkey.com"]
    prepareEmployeesCsv(fileName, data)

    const catalog = new CsvEmployeeCatalog(fileName)
    const employees = await catalog.loadAll()

    expect(employees).toContainEqual(employeeFrom("Herman", "Toothrot", "1960-07-01", "h.t.marley@monkey.com"))
})
