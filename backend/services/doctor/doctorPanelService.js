import crypto from 'crypto'
import doctorModel from '../../models/doctorModel.js'
import appointmentModel from '../../models/appointmentModel.js'
import userModel from '../../models/userModel.js'
import prescriptionModel from '../../models/prescriptionModel.js'
import labReportModel from '../../models/labReportModel.js'
import followUpInviteModel from '../../models/followUpInviteModel.js'
import { isWithinJoinWindow, buildVideoJoinPayload } from '../../utils/videoConsultation.js'

const changeAvailability = async (docId) => {
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    return { success: true, message: 'Availablitty Changed' }
}

const doctorList = async () => {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    return { success: true, doctors }
}

const appointmentDoctor = async (docId) => {
    const appointments = await appointmentModel.find({ docId })
    return { success: true, appointments }
}

const appointmentComplete = async (docId, appointmentId) => {
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
        return { success: true, message: 'Appointment Completed' }
    }
    return { success: false, message: 'Mark Failed' }
}

const appointmentCancelDoctor = async (docId, appointmentId) => {
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        const { slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        return { success: true, message: 'Appointment Cancelled' }
    }
    return { success: false, message: 'Cancellation Failed' }
}

const doctorDashboard = async (docId) => {
    const appointments = await appointmentModel.find({ docId })
    let earnings = 0
    appointments.forEach((item) => {
        if (item.isCompleted || item.payment) {
            earnings += item.amount
        }
    })
    const patients = []
    appointments.forEach((item) => {
        if (!patients.includes(item.userId)) {
            patients.push(item.userId)
        }
    })
    const dashData = {
        earnings,
        appointments: appointments.length,
        patients: patients.length,
        latestAppointments: appointments.slice().reverse().slice(0, 5),
    }
    return { success: true, dashData }
}

const doctorProfile = async (docId) => {
    const profileData = await doctorModel.findById(docId).select('-password')
    return { success: true, profileData }
}

const updateDoctorProfile = async (docId, { fee, address, available }) => {
    await doctorModel.findByIdAndUpdate(docId, { fee, address, available })
    return { success: true, message: 'Profile Updated' }
}

const getPatientHistory = async (docId, patientId) => {
    const hasAppointment = await appointmentModel.findOne({
        docId,
        userId: patientId,
    })
    if (!hasAppointment) {
        return {
            success: false,
            status: 403,
            message: "Not authorized to view this patient's history",
        }
    }

    const patient = await userModel.findById(patientId).select('-password')
    if (!patient) {
        return { success: false, status: 404, message: 'Patient not found' }
    }

    const prescriptions = await prescriptionModel.find({ patientId }).sort({ prescriptionDate: -1 }).lean()

    const appts = await appointmentModel.find({ docId, userId: patientId }).select('_id').lean()
    const appointmentIds = appts.map((a) => a._id)
    const labReports = await labReportModel
        .find({ patientId, appointmentId: { $in: appointmentIds } })
        .sort({ uploadedAt: -1 })
        .lean()

    return {
        success: true,
        patient,
        prescriptions,
        labReports,
    }
}

const updatePatientHealth = async (docId, patientId, { allergies, chronicConditions }) => {
    const hasAppointment = await appointmentModel.findOne({
        docId,
        userId: patientId,
    })
    if (!hasAppointment) {
        return {
            success: false,
            status: 403,
            message: "Not authorized to update this patient's health info",
        }
    }

    let allergiesArr = Array.isArray(allergies) ? allergies : []
    if (typeof allergies === 'string') {
        try {
            const parsed = JSON.parse(allergies || '[]')
            allergiesArr = Array.isArray(parsed) ? parsed : []
        } catch (_) {
            allergiesArr = []
        }
    }

    let conditionsArr = Array.isArray(chronicConditions) ? chronicConditions : []
    if (typeof chronicConditions === 'string') {
        try {
            const parsed = JSON.parse(chronicConditions || '[]')
            conditionsArr = Array.isArray(parsed) ? parsed : []
        } catch (_) {
            conditionsArr = []
        }
    }

    const patient = await userModel
        .findByIdAndUpdate(patientId, { allergies: allergiesArr, chronicConditions: conditionsArr }, { new: true })
        .select('-password')

    if (!patient) {
        return { success: false, status: 404, message: 'Patient not found' }
    }

    return { success: true, message: 'Health information updated', patient }
}

const suggestFollowUp = async ({ docId, appointmentId, slotDate, slotTime }) => {
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (!appointmentData) {
        return { success: false, status: 404, message: 'Appointment not found' }
    }
    if (appointmentData.docId.toString() !== docId.toString()) {
        return { success: false, status: 403, message: 'Not authorized for this appointment' }
    }
    const patientId = appointmentData.userId

    const docData = await doctorModel.findById(docId)
    if (!docData) {
        return { success: false, status: 404, message: 'Doctor not found' }
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
    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
        return { success: false, message: 'Slot not available' }
    }

    if (slots_booked[slotDate]) {
        slots_booked[slotDate].push(slotTime)
    } else {
        slots_booked[slotDate] = [slotTime]
    }
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    const token = crypto.randomBytes(32).toString('hex')
    const invite = new followUpInviteModel({
        patientId,
        docId,
        slotDate,
        slotTime,
        sourceAppointmentId: appointmentId,
        token,
        status: 'pending',
        createdAt: Date.now(),
    })
    await invite.save()

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const followUpLink = `${baseUrl}/follow-up-book?token=${token}`
    return { success: true, followUpLink }
}

const startVideoConsultation = async (docId, appointmentId) => {
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
        return { success: false, status: 404, message: 'Appointment not found' }
    }
    if (String(appointment.docId) !== String(docId)) {
        return { success: false, status: 403, message: 'Not authorized for this appointment' }
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
    if (!isWithinJoinWindow(appointment)) {
        return {
            success: false,
            status: 400,
            message: 'Video call can only be started near appointment time',
        }
    }

    const videoRoomId = appointment.videoRoomId || `prescripto-${appointment._id.toString()}`
    appointment.videoProvider = appointment.videoProvider || 'jitsi'
    appointment.videoRoomId = videoRoomId
    appointment.videoStatus = 'live'
    appointment.callStartedAt = appointment.callStartedAt || Date.now()
    await appointment.save()

    const session = buildVideoJoinPayload(appointment, 'doctor')
    return { success: true, message: 'Video call started', session }
}

const getDoctorVideoJoinDetails = async (docId, appointmentId) => {
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
        return { success: false, status: 404, message: 'Appointment not found' }
    }
    if (String(appointment.docId) !== String(docId)) {
        return { success: false, status: 403, message: 'Not authorized for this appointment' }
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
        return { success: false, status: 400, message: 'Video call is not started yet' }
    }
    if (!isWithinJoinWindow(appointment)) {
        return {
            success: false,
            status: 400,
            message: 'Video call can only be joined near appointment time',
        }
    }

    const session = buildVideoJoinPayload(appointment, 'doctor')
    return { success: true, session }
}

const endVideoConsultation = async (docId, appointmentId) => {
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
        return { success: false, status: 404, message: 'Appointment not found' }
    }
    if (String(appointment.docId) !== String(docId)) {
        return { success: false, status: 403, message: 'Not authorized for this appointment' }
    }
    if (appointment.consultationMode !== 'video') {
        return {
            success: false,
            status: 400,
            message: 'This appointment is not configured for video consultation',
        }
    }

    appointment.videoStatus = 'ended'
    appointment.callEndedAt = Date.now()
    await appointment.save()

    return { success: true, message: 'Video call ended' }
}

export {
    changeAvailability,
    doctorList,
    appointmentDoctor,
    appointmentComplete,
    appointmentCancelDoctor,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    getPatientHistory,
    updatePatientHealth,
    suggestFollowUp,
    startVideoConsultation,
    getDoctorVideoJoinDetails,
    endVideoConsultation,
}
