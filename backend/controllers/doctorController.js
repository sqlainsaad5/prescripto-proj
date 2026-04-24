import { loginDoctor as loginDoctorSvc } from '../services/auth/doctorAuthService.js'
import {
    changeAvailability as changeAvailabilitySvc,
    doctorList as doctorListSvc,
    appointmentDoctor as appointmentDoctorSvc,
    appointmentComplete as appointmentCompleteSvc,
    appointmentCancelDoctor as appointmentCancelDoctorSvc,
    doctorDashboard as doctorDashboardSvc,
    doctorProfile as doctorProfileSvc,
    updateDoctorProfile as updateDoctorProfileSvc,
    getPatientHistory as getPatientHistorySvc,
    updatePatientHealth as updatePatientHealthSvc,
    suggestFollowUp as suggestFollowUpSvc,
    startVideoConsultation as startVideoConsultationSvc,
    getDoctorVideoJoinDetails as getDoctorVideoJoinDetailsSvc,
    endVideoConsultation as endVideoConsultationSvc,
} from '../services/doctor/doctorPanelService.js'

const jsonOrStatus = (res, result) => {
    if (!result.success && result.status) {
        return res.status(result.status).json({ success: false, message: result.message })
    }
    return res.json(result)
}

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body
        const result = await changeAvailabilitySvc(docId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        const result = await doctorListSvc()
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginDoctor = async (req, res) => {
    try {
        const result = await loginDoctorSvc(req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentDoctor = async (req, res) => {
    try {
        const { docId } = req.body
        const result = await appointmentDoctorSvc(docId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const result = await appointmentCompleteSvc(docId, appointmentId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const result = await appointmentCancelDoctorSvc(docId, appointmentId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body
        const result = await doctorDashboardSvc(docId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const result = await doctorProfileSvc(docId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fee, address, available } = req.body
        const result = await updateDoctorProfileSvc(docId, { fee, address, available })
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params
        const { docId } = req.body
        const result = await getPatientHistorySvc(docId, patientId)
        return jsonOrStatus(res, result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updatePatientHealth = async (req, res) => {
    try {
        const { patientId } = req.params
        const { docId, allergies, chronicConditions } = req.body
        const result = await updatePatientHealthSvc(docId, patientId, { allergies, chronicConditions })
        return jsonOrStatus(res, result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const suggestFollowUp = async (req, res) => {
    try {
        const result = await suggestFollowUpSvc(req.body)
        if (!result.success && result.status) {
            return res.status(result.status).json({ success: false, message: result.message })
        }
        return res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const startVideoConsultation = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const result = await startVideoConsultationSvc(docId, appointmentId)
        if (!result.success) {
            return res.status(result.status || 400).json({ success: false, message: result.message })
        }
        return res.json({ success: true, message: result.message, session: result.session })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getDoctorVideoJoinDetails = async (req, res) => {
    try {
        const { docId } = req.body
        const { appointmentId } = req.params
        const result = await getDoctorVideoJoinDetailsSvc(docId, appointmentId)
        if (!result.success) {
            return res.status(result.status || 400).json({ success: false, message: result.message })
        }
        return res.json({ success: true, session: result.session })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const endVideoConsultation = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const result = await endVideoConsultationSvc(docId, appointmentId)
        if (!result.success) {
            return res.status(result.status || 400).json({ success: false, message: result.message })
        }
        return res.json({ success: true, message: result.message })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentDoctor,
    appointmentComplete,
    appointmentCancel,
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
