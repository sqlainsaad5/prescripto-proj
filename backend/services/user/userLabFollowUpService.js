import { v2 as cloudinary } from 'cloudinary'
import userModel from '../../models/userModel.js'
import doctorModel from '../../models/doctorModel.js'
import appointmentModel from '../../models/appointmentModel.js'
import labReportModel from '../../models/labReportModel.js'
import followUpInviteModel from '../../models/followUpInviteModel.js'

const uploadLabReport = async (userId, { appointmentId, type }, file) => {
    if (!file || !file.path) {
        return { success: false, status: 400, message: 'No file uploaded' }
    }

    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
        return { success: false, status: 404, message: 'Appointment not found' }
    }
    if (String(appointment.userId) !== String(userId)) {
        return { success: false, status: 403, message: 'Not authorized to upload for this appointment' }
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: 'auto' })
    const fileUrl = uploadResult.secure_url

    const labReport = await labReportModel.create({
        appointmentId,
        patientId: appointment.userId,
        type,
        fileUrl,
        fileName: file.originalname || '',
    })

    return { success: true, labReport }
}

const getFollowUpByToken = async (token) => {
    const invite = await followUpInviteModel.findOne({ token, status: 'pending' })
    if (!invite) {
        return { success: false, status: 404, message: 'Invalid or expired link' }
    }
    const docData = await doctorModel.findById(invite.docId).select('-password')
    if (!docData) {
        return { success: false, status: 404, message: 'Doctor not found' }
    }
    const docDataObj = docData.toObject ? docData.toObject() : docData
    delete docDataObj.slots_booked
    return {
        success: true,
        docId: invite.docId,
        slotDate: invite.slotDate,
        slotTime: invite.slotTime,
        docData: docDataObj,
        patientId: invite.patientId.toString(),
    }
}

const confirmFollowUp = async (userId, token) => {
    const invite = await followUpInviteModel.findOne({ token, status: 'pending' })
    if (!invite) {
        return { success: false, status: 404, message: 'Invalid or expired link' }
    }
    if (invite.patientId.toString() !== userId) {
        return { success: false, status: 403, message: 'This link is for another patient' }
    }

    const { docId, slotDate, slotTime } = invite
    const userData = await userModel.findById(userId).select('-password')
    const docData = await doctorModel.findById(docId).select('-password')
    if (!userData || !docData) {
        return { success: false, status: 404, message: 'User or doctor not found' }
    }
    delete docData.slots_booked

    const sourceAppointment = await appointmentModel.findById(invite.sourceAppointmentId).select('consultationMode')
    const consultationMode = sourceAppointment?.consultationMode === 'video' ? 'video' : 'in_person'

    const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        amount: docData.fee,
        slotTime,
        slotDate,
        date: Date.now(),
        consultationMode,
    }
    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()
    await followUpInviteModel.findByIdAndUpdate(invite._id, { status: 'completed' })

    return { success: true, message: 'Follow-up appointment confirmed' }
}

export { uploadLabReport, getFollowUpByToken, confirmFollowUp }
