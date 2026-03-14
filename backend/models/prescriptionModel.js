import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String, default: "" }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    medicines: { type: [medicineSchema], required: true },
    prescriptionDate: { type: Date, default: Date.now },
    prescriptionPDF: { type: String },
    notes: { type: String, default: "" }
});

const prescriptionModel = mongoose.models.prescription || mongoose.model('prescription', prescriptionSchema);

export default prescriptionModel;

