import crypto from 'crypto'
import doctorModel from "../models/doctorModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"
import prescriptionModel from "../models/prescriptionModel.js"
import labReportModel from "../models/labReportModel.js"
import followUpInviteModel from "../models/followUpInviteModel.js"
import { isWithinJoinWindow, buildVideoJoinPayload } from "../utils/videoConsultation.js"

const changeAvailability = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablitty Changed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//api for doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: 'Invalid Credentials' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to get doctor appointmnets for doctor panel
const appointmentDoctor = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Api appointment complete for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            res.json({ success: true, message: "Appointment Completed" })
        }
        else {
            res.json({ success: false, message: "Mark Failed" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Api cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

            // releasing doctor slot
            const { slotDate, slotTime } = appointmentData
            const doctorData = await doctorModel.findById(docId)
            let slots_booked = doctorData.slots_booked
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
            await doctorModel.findByIdAndUpdate(docId, { slots_booked })

            res.json({ success: true, message: "Appointment Cancelled" })
        }
        else {
            res.json({ success: false, message: "Cancellation Failed" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to get doctor profile for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })
        let earnings = 0
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })
        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)

            }
        })
        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5),

        }
        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//Api to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Api to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fee, address, available } = req.body
        await doctorModel.findByIdAndUpdate(docId, { fee, address, available })
        res.json({ success: true, message: "Profile Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API: get patient history (EHR) - doctor may only access for patients they have an appointment with
const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params
        const { docId } = req.body

        if (!patientId) {
            return res.status(400).json({ success: false, message: "Patient ID required" })
        }

        const hasAppointment = await appointmentModel.findOne({
            docId,
            userId: patientId
        })
        if (!hasAppointment) {
            return res.status(403).json({ success: false, message: "Not authorized to view this patient's history" })
        }

        const patient = await userModel.findById(patientId).select("-password")
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" })
        }

        const prescriptions = await prescriptionModel
            .find({ patientId })
            .sort({ prescriptionDate: -1 })
            .lean()

        const appts = await appointmentModel.find({ docId, userId: patientId }).select('_id').lean()
        const appointmentIds = appts.map((a) => a._id)
        const labReports = await labReportModel
            .find({ patientId, appointmentId: { $in: appointmentIds } })
            .sort({ uploadedAt: -1 })
            .lean()

        return res.json({
            success: true,
            patient,
            prescriptions,
            labReports
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Doctor: update patient allergies and chronic conditions (only for patients they have an appointment with)
const updatePatientHealth = async (req, res) => {
    try {
        const { patientId } = req.params
        const { docId, allergies, chronicConditions } = req.body

        if (!patientId) {
            return res.status(400).json({ success: false, message: "Patient ID required" })
        }

        const hasAppointment = await appointmentModel.findOne({
            docId,
            userId: patientId
        })
        if (!hasAppointment) {
            return res.status(403).json({ success: false, message: "Not authorized to update this patient's health info" })
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
            return res.status(404).json({ success: false, message: "Patient not found" })
        }

        return res.json({ success: true, message: "Health information updated", patient })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Suggest follow-up: reserve slot and create priority booking link for patient
const suggestFollowUp = async (req, res) => {
    try {
        const { docId, appointmentId, slotDate, slotTime } = req.body
        if (!appointmentId || !slotDate || !slotTime) {
            return res.status(400).json({ success: false, message: 'appointmentId, slotDate and slotTime required' })
        }

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }
        if (appointmentData.docId.toString() !== docId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized for this appointment' })
        }
        const patientId = appointmentData.userId

        const docData = await doctorModel.findById(docId)
        if (!docData) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }
        let slots_booked = docData.slots_booked || {}

        const alreadyBooked = await appointmentModel.findOne({
            docId,
            slotDate,
            slotTime,
            cancelled: false
        })
        if (alreadyBooked) {
            return res.json({ success: false, message: 'Slot already booked' })
        }
        if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: 'Slot not available' })
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
            createdAt: Date.now()
        })
        await invite.save()

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const followUpLink = `${baseUrl}/follow-up-book?token=${token}`
        return res.json({ success: true, followUpLink })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const startVideoConsultation = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Appointment ID required' })
        }

        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }
        if (String(appointment.docId) !== String(docId)) {
            return res.status(403).json({ success: false, message: 'Not authorized for this appointment' })
        }
        if (appointment.cancelled || appointment.isCompleted) {
            return res.status(400).json({ success: false, message: 'Appointment is not active for video call' })
        }
        if (appointment.consultationMode !== 'video') {
            return res.status(400).json({ success: false, message: 'This appointment is not configured for video consultation' })
        }
        if (!isWithinJoinWindow(appointment)) {
            return res.status(400).json({ success: false, message: 'Video call can only be started near appointment time' })
        }

        const videoRoomId = appointment.videoRoomId || `prescripto-${appointment._id.toString()}`
        appointment.videoProvider = appointment.videoProvider || 'jitsi'
        appointment.videoRoomId = videoRoomId
        appointment.videoStatus = 'live'
        appointment.callStartedAt = appointment.callStartedAt || Date.now()
        await appointment.save()

        const session = buildVideoJoinPayload(appointment, 'doctor')
        return res.json({ success: true, message: 'Video call started', session })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getDoctorVideoJoinDetails = async (req, res) => {
    try {
        const { docId } = req.body
        const { appointmentId } = req.params
        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Appointment ID required' })
        }

        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }
        if (String(appointment.docId) !== String(docId)) {
            return res.status(403).json({ success: false, message: 'Not authorized for this appointment' })
        }
        if (appointment.cancelled || appointment.isCompleted) {
            return res.status(400).json({ success: false, message: 'Appointment is not active for video call' })
        }
        if (appointment.consultationMode !== 'video') {
            return res.status(400).json({ success: false, message: 'This appointment is not configured for video consultation' })
        }
        if (!appointment.videoRoomId || appointment.videoStatus !== 'live') {
            return res.status(400).json({ success: false, message: 'Video call is not started yet' })
        }
        if (!isWithinJoinWindow(appointment)) {
            return res.status(400).json({ success: false, message: 'Video call can only be joined near appointment time' })
        }

        const session = buildVideoJoinPayload(appointment, 'doctor')
        return res.json({ success: true, session })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const endVideoConsultation = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Appointment ID required' })
        }

        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }
        if (String(appointment.docId) !== String(docId)) {
            return res.status(403).json({ success: false, message: 'Not authorized for this appointment' })
        }
        if (appointment.consultationMode !== 'video') {
            return res.status(400).json({ success: false, message: 'This appointment is not configured for video consultation' })
        }

        appointment.videoStatus = 'ended'
        appointment.callEndedAt = Date.now()
        await appointment.save()

        return res.json({ success: true, message: 'Video call ended' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentDoctor, appointmentComplete,
    appointmentCancel, doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    getPatientHistory,
    updatePatientHealth,
    suggestFollowUp,
    startVideoConsultation,
    getDoctorVideoJoinDetails,
    endVideoConsultation
}