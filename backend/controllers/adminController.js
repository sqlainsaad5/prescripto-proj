import { loginAdmin as loginAdminSvc } from '../services/auth/adminAuthService.js'
import {
    addDoctor as addDoctorSvc,
    allDoctors as allDoctorsSvc,
    appointmentsAdmin as appointmentsAdminSvc,
    appointmentCancelAdmin as appointmentCancelAdminSvc,
    adminDashboard as adminDashboardSvc,
} from '../services/admin/adminPanelService.js'

const addDoctor = async (req, res) => {
    try {
        const result = await addDoctorSvc(req.body, req.file)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginAdmin = async (req, res) => {
    try {
        const result = await loginAdminSvc(req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const allDoctors = async (req, res) => {
    try {
        const result = await allDoctorsSvc()
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentsAdmin = async (req, res) => {
    try {
        const result = await appointmentsAdminSvc()
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const result = await appointmentCancelAdminSvc(appointmentId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const adminDashboard = async (req, res) => {
    try {
        const result = await adminDashboardSvc()
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard }
