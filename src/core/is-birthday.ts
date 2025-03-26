export function isBirthDay(bornOn: Date, today: Date) {
    if(!isLeapYear(today) && bornOn.getDate() === 29 && today.getDate() === 28) return true

    return today.getDate() === bornOn.getDate() && today.getMonth() === bornOn.getMonth()
}

const isLeapYear = (today: Date): boolean => today.getFullYear() % 4 === 0
