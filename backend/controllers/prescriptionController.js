import appointmentModel from "../models/appointmentModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import { generatePrescriptionPdf } from "../services/prescriptionPdfService.js";

// Doctor: create a new prescription for an appointment
const createPrescription = async (req, res) => {
    try {
        const { docId, appointmentId, medicines } = req.body;

        if (!appointmentId || !Array.isArray(medicines) || medicines.length === 0) {
            return res.json({ success: false, message: "Missing appointment or medicines data" });
        }

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointment.docId.toString() !== docId.toString()) {
            return res.json({ success: false, message: "Not authorized to create prescription for this appointment" });
        }

        // prevent duplicate prescriptions for the same appointment
        const existing = await prescriptionModel.findOne({ appointmentId });
        if (existing) {
            return res.json({ success: false, message: "Prescription already exists for this appointment" });
        }

        const prescription = await prescriptionModel.create({
            appointmentId,
            patientId: appointment.userId,
            doctorId: appointment.docId,
            medicines
        });

        try {
            const doctor = await doctorModel.findById(appointment.docId).select('-password');
            const patient = await userModel.findById(appointment.userId).select('-password');
            const pdfUrl = await generatePrescriptionPdf({
                prescription,
                appointment,
                doctor: doctor || {},
                patient: patient || {}
            });
            if (pdfUrl) {
                prescription.prescriptionPDF = pdfUrl;
                await prescription.save();
            }
        } catch (pdfErr) {
            console.error('Prescription PDF generation failed:', pdfErr);
        }

        return res.json({
            success: true,
            message: "Prescription created successfully",
            prescription
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Doctor: get prescription by appointment
const getPrescriptionByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { docId } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointment.docId.toString() !== docId.toString()) {
            return res.json({ success: false, message: "Not authorized to view prescription for this appointment" });
        }

        const prescription = await prescriptionModel.findOne({ appointmentId });

        if (!prescription) {
            return res.json({ success: false, message: "Prescription not found" });
        }

        return res.json({ success: true, prescription });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Patient: download prescription PDF (proxy from Cloudinary with attachment disposition)
const downloadPrescriptionPdf = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const userId = req.userId;

        const prescription = await prescriptionModel.findById(prescriptionId);
        if (!prescription) {
            return res.status(404).json({ success: false, message: "Prescription not found" });
        }
        if (String(prescription.patientId) !== String(userId)) {
            return res.status(403).json({ success: false, message: "Not authorized to download this prescription" });
        }
        if (!prescription.prescriptionPDF) {
            return res.status(404).json({ success: false, message: "PDF not available for this prescription" });
        }

        const response = await fetch(prescription.prescriptionPDF);
        if (!response.ok) {
            return res.status(502).json({ success: false, message: "Failed to fetch PDF" });
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        const dateStr = prescription.prescriptionDate
            ? new Date(prescription.prescriptionDate).toISOString().slice(0, 10)
            : prescription._id.toString();
        const filename = `Prescription-${dateStr}.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(buffer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Patient: get all prescriptions for a patient
const getPrescriptionsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const userId = req.userId;

        if (patientId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Not authorized to view these prescriptions" });
        }

        const prescriptions = await prescriptionModel
            .find({ patientId })
            .sort({ prescriptionDate: -1 });

        return res.json({ success: true, prescriptions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    createPrescription,
    getPrescriptionByAppointment,
    getPrescriptionsByPatient,
    downloadPrescriptionPdf
};

