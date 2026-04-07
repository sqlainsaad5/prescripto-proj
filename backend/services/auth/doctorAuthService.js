import bcrypt from 'bcrypt'
import doctorModel from '../../models/doctorModel.js'
import { signDoctorToken } from './tokenService.js'

const loginDoctor = async ({ email, password }) => {
    const doctor = await doctorModel.findOne({ email })
    if (!doctor) {
        return { success: false, message: 'Doctor not found' }
    }

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (isMatch) {
        const token = signDoctorToken(doctor._id)
        return { success: true, token }
    }

    return { success: false, message: 'Invalid Credentials' }
}

export { loginDoctor }
