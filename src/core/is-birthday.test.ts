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
