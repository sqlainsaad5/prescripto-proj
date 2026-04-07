import { v2 as cloudinary } from 'cloudinary'
import userModel from '../../models/userModel.js'

const getProfile = async (userId) => {
    const userData = await userModel.findById(userId).select('-password')
    return { success: true, userData }
}

const updateProfile = async (userId, { name, phone, address, dob, gender }, imageFile) => {
    const updateData = {
        name,
        phone,
        address: typeof address === 'string' ? JSON.parse(address) : address,
        dob,
        gender,
    }
    await userModel.findByIdAndUpdate(userId, updateData)

    if (imageFile) {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
        const image = imageUpload.secure_url
        await userModel.findByIdAndUpdate(userId, { image }, { new: true })
    }

    return { success: true, message: 'Profile Updated' }
}

export { getProfile, updateProfile }
