import { expect, test } from "@jest/globals"
import { isBirthDay } from "./is-birthday"

test("is birthday", () => {
    const dateOfBirth = new Date("1981-11-01")
    const today = new Date("2025-11-01")

    expect(isBirthDay(dateOfBirth, today)).toBeTruthy()
})

test("is not birthday", () => {
    const dateOfBirth = new Date("1981-11-01")
    const today = new Date("2025-03-20")

    expect(isBirthDay(dateOfBirth, today)).toBeFalsy()
})

test("born on February 29th, in a leap year", () => {
    const dateOfBirth = new Date("1980-02-29")
    const today = new Date("2024-02-29")

    expect(isBirthDay(dateOfBirth, today)).toBeTruthy()
})

test("born on February 29th, not in a leap year", () => {
    const dateOfBirth = new Date("1980-02-29")
    const today = new Date("2025-02-28")

    expect(isBirthDay(dateOfBirth, today)).toBeTruthy()
})
