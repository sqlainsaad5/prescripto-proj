import appointmentModel from '../models/appointmentModel.js'
import prescriptionModel from '../models/prescriptionModel.js'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'
import { generatePrescriptionPdf } from './prescriptionPdfService.js'

const createPrescription = async ({ docId, appointmentId, medicines, notes }) => {
    const appointment = await appointmentModel.findById(appointmentId)

    if (!appointment) {
        return { success: false, message: 'Appointment not found' }
    }

    if (appointment.docId.toString() !== docId.toString()) {
        return { success: false, message: 'Not authorized to create prescription for this appointment' }
    }

    const existing = await prescriptionModel.findOne({ appointmentId })
    if (existing) {
        return { success: false, message: 'Prescription already exists for this appointment' }
    }

    const prescription = await prescriptionModel.create({
        appointmentId,
        patientId: appointment.userId,
        doctorId: appointment.docId,
        medicines,
        notes: notes || '',
    })

    try {
        const doctor = await doctorModel.findById(appointment.docId).select('-password')
        const patient = await userModel.findById(appointment.userId).select('-password')
        const pdfUrl = await generatePrescriptionPdf({
            prescription,
            appointment,
            doctor: doctor || {},
            patient: patient || {},
        })
        if (pdfUrl) {
            prescription.prescriptionPDF = pdfUrl
            await prescription.save()
        }
    } catch (pdfErr) {
        console.error('Prescription PDF generation failed:', pdfErr)
    }

    return {
        success: true,
        message: 'Prescription created successfully',
        prescription,
    }
}

const getPrescriptionByAppointment = async (docId, appointmentId) => {
    const appointment = await appointmentModel.findById(appointmentId)

    if (!appointment) {
        return { success: false, message: 'Appointment not found' }
    }

    if (appointment.docId.toString() !== docId.toString()) {
        return { success: false, message: 'Not authorized to view prescription for this appointment' }
    }

    const prescription = await prescriptionModel.findOne({ appointmentId })

    if (!prescription) {
        return { success: false, message: 'Prescription not found' }
    }

    return { success: true, prescription }
}

const getPrescriptionsByPatient = async (userId, patientId) => {
    if (patientId.toString() !== userId.toString()) {
        return { success: false, message: 'Not authorized to view these prescriptions' }
    }

    const prescriptions = await prescriptionModel.find({ patientId }).sort({ prescriptionDate: -1 })

    return { success: true, prescriptions }
}

const getPrescriptionPdfForDownload = async (userId, prescriptionId) => {
    const prescription = await prescriptionModel.findById(prescriptionId)
    if (!prescription) {
        return { success: false, status: 404, message: 'Prescription not found' }
    }
    if (String(prescription.patientId) !== String(userId)) {
        return { success: false, status: 403, message: 'Not authorized to download this prescription' }
    }
    if (!prescription.prescriptionPDF) {
        return { success: false, status: 404, message: 'PDF not available for this prescription' }
    }

    const response = await fetch(prescription.prescriptionPDF)
    if (!response.ok) {
        return { success: false, status: 502, message: 'Failed to fetch PDF' }
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const dateStr = prescription.prescriptionDate
        ? new Date(prescription.prescriptionDate).toISOString().slice(0, 10)
        : prescription._id.toString()
    const filename = `Prescription-${dateStr}.pdf`

    return { success: true, buffer, filename }
}

export {
    createPrescription,
    getPrescriptionByAppointment,
    getPrescriptionsByPatient,
    getPrescriptionPdfForDownload,
}
