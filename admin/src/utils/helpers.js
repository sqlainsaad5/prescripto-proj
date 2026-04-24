export const calculateAge = (dob) => {
    if (!dob) return 0
    const today = new Date()
    const birthDate = new Date(dob)
    if (Number.isNaN(birthDate.getTime())) return 0

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const dayDiff = today.getDate() - birthDate.getDate()
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age -= 1
    }
    return Math.max(age, 0)
}

export const slotDateFormat = (slotDate) => {
    const months = [" ", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
}

export const currency = "PKR"
