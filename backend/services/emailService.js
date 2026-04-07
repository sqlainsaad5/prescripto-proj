import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

/**
 * Send a contact form email
 * @param {string} name - Name of the sender
 * @param {string} fromEmail - Email of the sender
 * @param {string} subject - Subject of the message
 * @param {string} message - The message content
 */
const sendContactEmail = async (name, fromEmail, subject, message) => {
    try {
        const mailOptions = {
            from: fromEmail,
            to: process.env.EMAIL_USER,
            subject: `Contact Form: ${subject}`,
            text: `Name: ${name}\nEmail: ${fromEmail}\n\nMessage:\n${message}`
        }

        console.log("Attempting to send contact email via Service...");
        await transporter.sendMail(mailOptions)
        console.log("Contact email sent successfully via Service");
        return { success: true }
    } catch (error) {
        console.log("Email Service Error (Contact):", error)
        throw new Error(error.message)
    }
}

/**
 * Generic email sender
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 */
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        }

        console.log(`Attempting to send email to ${to}...`);
        await transporter.sendMail(mailOptions)
        console.log(`Email sent successfully to ${to}`);
        return { success: true }
    } catch (error) {
        console.log("Email Service Error (Generic):", error)
        throw new Error(error.message)
    }
}
export { sendContactEmail, sendEmail }

