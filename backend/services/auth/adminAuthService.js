import { signAdminToken } from './tokenService.js'

const loginAdmin = async ({ email, password }) => {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = signAdminToken(email, password)
        return { success: true, token }
    }
    return { success: false, message: 'Invalid credential' }
}

export { loginAdmin }
