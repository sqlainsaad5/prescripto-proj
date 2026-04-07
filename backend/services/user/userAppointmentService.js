import doctorModel from '../../models/doctorModel.js'
import userModel from '../../models/userModel.js'
import appointmentModel from '../../models/appointmentModel.js'
import { isWithinJoinWindow, buildVideoJoinPayload } from '../../utils/videoConsultation.js'

const bookAppointment = async (userId, { docId, slotDate, slotTime, consultationMode }) => {
    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
        return { success: false, message: 'Doctor not available' }
    }

    let slots_booked = docData.slots_booked || {}

    const alreadyBooked = await appointmentModel.findOne({
        docId,
        slotDate,
        slotTime,
        cancelled: false,
    })

    if (alreadyBooked) {
        return { success: false, message: 'Slot already booked' }
    }

    if (slots_booked[slotDate]) {
        if (slots_booked[slotDate].includes(slotTime)) {
            return { success: false, message: 'slot not available' }
        }
        slots_booked[slotDate].push(slotTime)
    } else {
        slots_booked[slotDate] = []
        slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')
    delete docData.slots_booked

    const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        amount: docData.fee,
        slotTime,
        slotDate,
        date: Date.now(),
        consultationMode: consultationMode === 'video' ? 'video' : 'in_person',
    }
    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    return { success: true, message: 'Appointment Booked' }
}

const bookAppointmentSafe = async (userId, body) => {
    try {
        return await bookAppointment(userId, body)
    } catch (error) {
        if (error.code === 11000) {
            return { success: false, message: 'Slot already booked' }
        }
        throw error
    }
}

const getUserVideoJoinDetails = async (userId, appointmentId) => {
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
        return { success: false, status: 404, message: 'Appointment not found' }
    }
    if (String(appointment.userId) !== String(userId)) {
        return { success: false, status: 403, message: 'Unauthorized Action' }
    }
    if (appointment.cancelled || appointment.isCompleted) {
        return { success: false, status: 400, message: 'Appointment is not active for video call' }
    }
    if (appointment.consultationMode !== 'video') {
        return {
            success: false,
            status: 400,
            message: 'This appointment is not configured for video consultation',
        }
    }
    if (!appointment.videoRoomId || appointment.videoStatus !== 'live') {
        return { success: false, status: 400, message: 'Doctor has not started the call yet' }
    }
    if (!isWithinJoinWindow(appointment)) {
        return {
            success: false,
            status: 400,
            message: 'Video call can only be joined near appointment time',
        }
    }

    const session = buildVideoJoinPayload(appointment, 'patient')
    return { success: true, session }
}

const listAppointment = async (userId) => {
    const appointments = await appointmentModel.find({ userId })
    return { success: true, appointments }
}

const cancelAppointment = async (userId, appointmentId) => {
    if (!userId) {
        return { success: false, message: 'User not authenticated' }
    }

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (String(appointmentData.userId) !== String(userId)) {
        return { success: false, message: 'Unauthorized Action' }
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    return { success: true, message: 'Appointment Cancelled' }
}

export {
    bookAppointmentSafe as bookAppointment,
    getUserVideoJoinDetails,
    listAppointment,
    cancelAppointment,
}
