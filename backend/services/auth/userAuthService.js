import bcrypt from 'bcrypt'
import userModel from '../../models/userModel.js'
import { signUserToken } from './tokenService.js'

const registerUser = async ({ name, email, password }) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = { name, email, password: hashedPassword }
    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = signUserToken(user._id)
    return { success: true, token }
}

const loginUser = async ({ email, password }) => {
    const user = await userModel.findOne({ email })

    if (!user) {
        return { success: false, message: 'User does not Exist' }
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
        const token = signUserToken(user._id)
        return { success: true, token }
    }

    return { success: false, message: 'Invalid Credentials' }
}

export { registerUser, loginUser }
