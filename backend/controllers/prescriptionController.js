import {
    createPrescription as createPrescriptionSvc,
    getPrescriptionByAppointment as getPrescriptionByAppointmentSvc,
    getPrescriptionsByPatient as getPrescriptionsByPatientSvc,
    getPrescriptionPdfForDownload as getPrescriptionPdfForDownloadSvc,
} from '../services/prescriptionService.js'

const createPrescription = async (req, res) => {
    try {
        const result = await createPrescriptionSvc(req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getPrescriptionByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params
        const { docId } = req.body
        const result = await getPrescriptionByAppointmentSvc(docId, appointmentId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const downloadPrescriptionPdf = async (req, res) => {
    try {
        const { prescriptionId } = req.params
        const userId = req.userId
        const result = await getPrescriptionPdfForDownloadSvc(userId, prescriptionId)
        if (!result.success) {
            return res.status(result.status || 500).json({ success: false, message: result.message })
        }
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)
        res.send(result.buffer)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const getPrescriptionsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params
        const userId = req.userId
        const result = await getPrescriptionsByPatientSvc(userId, patientId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    createPrescription,
    getPrescriptionByAppointment,
    getPrescriptionsByPatient,
    downloadPrescriptionPdf,
}
