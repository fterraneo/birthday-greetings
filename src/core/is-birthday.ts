export function isBirthDay(bornOn: Date, today: Date) {
    return today.getDate() === bornOn.getDate() && today.getMonth() === bornOn.getMonth()
}
