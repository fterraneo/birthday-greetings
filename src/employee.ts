export type Employee = {
    firstName: string
    lastName: string
    bornOn: Date
    emailAddress: string
}

export function employeeFrom(firstName: string | undefined, lastName: string | undefined, isoDateOfBirth: string | undefined, emailAddress: string | undefined): Employee {
    if (!lastName || !firstName || !isoDateOfBirth || !emailAddress) throw new Error("invalid employee field(s)!")

    return {
        firstName: firstName,
        lastName: lastName,
        bornOn: new Date(isoDateOfBirth),
        emailAddress: emailAddress,
    }
}
