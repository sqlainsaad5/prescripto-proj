export const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)

    let age = today.getFullYear() - birthDate.getFullYear()
    return age
}

export const slotDateFormat = (slotDate) => {
    const months = [" ", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
}
