import { sendContactEmail } from '../emailService.js'

const sendContactMessage = async ({ name, email, subject, message }) => {
    await sendContactEmail(name, email, subject, message)
    return { success: true, message: 'Message Sent Successfully' }
}

export { sendContactMessage }
