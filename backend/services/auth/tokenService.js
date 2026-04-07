import jwt from 'jsonwebtoken'

const signUserToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET)
}

const signDoctorToken = (doctorId) => {
    return jwt.sign({ id: doctorId }, process.env.JWT_SECRET)
}

/** Admin panel — matches legacy: jwt.sign(email + password, JWT_SECRET) */
const signAdminToken = (email, password) => {
    return jwt.sign(email + password, process.env.JWT_SECRET)
}

export { signUserToken, signDoctorToken, signAdminToken }
