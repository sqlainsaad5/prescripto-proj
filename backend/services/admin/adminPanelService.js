import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../../models/doctorModel.js'
import appointmentModel from '../../models/appointmentModel.js'
import userModel from '../../models/userModel.js'

const addDoctor = async (body, imageFile) => {
    const { name, email, password, speciality, degree, experience, about, fee, address } = body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
    const imageUrl = imageUpload.secure_url

    const doctorData = {
        name,
        email,
        image: imageUrl,
        password: hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fee,
        address: JSON.parse(address),
        date: Date.now(),
    }
    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    return { success: true, message: 'Doctor Added' }
}

const allDoctors = async () => {
    const doctors = await doctorModel.find({}).select('-password')
    return { success: true, doctors }
}

const appointmentsAdmin = async () => {
    const appointments = await appointmentModel.find({})
    return { success: true, appointments }
}

const appointmentCancelAdmin = async (appointmentId) => {
    const appointmentData = await appointmentModel.findById(appointmentId)

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    return { success: true, message: 'Appointment Cancelled' }
}

const adminDashboard = async () => {
    const doctors = await doctorModel.find({})
    const users = await userModel.find()
    const appointments = await appointmentModel.find({})

    const dashData = {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        latestAppointments: appointments.slice().reverse().slice(0, 5),
    }

    return { success: true, dashData }
}

export { addDoctor, allDoctors, appointmentsAdmin, appointmentCancelAdmin, adminDashboard }
