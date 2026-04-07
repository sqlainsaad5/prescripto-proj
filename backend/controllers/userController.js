import { registerUser as registerUserSvc, loginUser as loginUserSvc } from '../services/auth/userAuthService.js'
import { getProfile as getProfileSvc, updateProfile as updateProfileSvc } from '../services/user/userProfileService.js'
import {
    bookAppointment as bookAppointmentSvc,
    getUserVideoJoinDetails as getUserVideoJoinDetailsSvc,
    listAppointment as listAppointmentSvc,
    cancelAppointment as cancelAppointmentSvc,
} from '../services/user/userAppointmentService.js'
import { createCheckoutSession, verifyStripePayment } from '../services/user/userPaymentService.js'
import { sendContactMessage } from '../services/user/userContactService.js'
import {
    uploadLabReport as uploadLabReportSvc,
    getFollowUpByToken as getFollowUpByTokenSvc,
    confirmFollowUp as confirmFollowUpSvc,
} from '../services/user/userLabFollowUpService.js'

const registerUser = async (req, res) => {
    try {
        const result = await registerUserSvc(req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const result = await loginUserSvc(req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getProfile = async (req, res) => {
    try {
        const result = await getProfileSvc(req.userId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body
        const result = await updateProfileSvc(req.userId, { name, phone, address, dob, gender }, req.file)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const bookAppointment = async (req, res) => {
    try {
        const result = await bookAppointmentSvc(req.userId, req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getUserVideoJoinDetails = async (req, res) => {
    try {
        const result = await getUserVideoJoinDetailsSvc(req.userId, req.params.appointmentId)
        if (!result.success) {
            return res.status(result.status || 400).json({ success: false, message: result.message })
        }
        return res.json({ success: true, session: result.session })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const listAppointment = async (req, res) => {
    try {
        const result = await listAppointmentSvc(req.userId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const result = await cancelAppointmentSvc(req.userId, appointmentId)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const { origin } = req.headers
        const result = await createCheckoutSession(appointmentId, origin)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {
        const result = await verifyStripePayment(req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const contactUs = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body
        console.log('Contact Request Received:', { name, email, subject })
        const result = await sendContactMessage({ name, email, subject, message })
        res.json(result)
    } catch (error) {
        console.log('Contact API Error:', error)
        res.status(500).json({
            success: false,
            message: error.message || 'Could not send message. Please try again later.',
        })
    }
}

const uploadLabReport = async (req, res) => {
    try {
        const result = await uploadLabReportSvc(req.userId, req.body, req.file)
        if (!result.success) {
            return res.status(result.status || 400).json({ success: false, message: result.message })
        }
        return res.json({ success: true, labReport: result.labReport })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getFollowUpByToken = async (req, res) => {
    try {
        const { token } = req.query
        const result = await getFollowUpByTokenSvc(token)
        if (!result.success) {
            return res.status(result.status || 404).json({ success: false, message: result.message })
        }
        return res.json(result)
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const confirmFollowUp = async (req, res) => {
    try {
        const { token } = req.body
        const result = await confirmFollowUpSvc(req.userId, token)
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
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentStripe,
    verifyStripe,
    contactUs,
    uploadLabReport,
    getFollowUpByToken,
    confirmFollowUp,
    getUserVideoJoinDetails,
}
