import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
    patientId: { type: String, required: true },
    type: { type: String, enum: ['xray', 'blood_test', 'diagnostic'], required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now }
});

const labReportModel = mongoose.models.labreport || mongoose.model('labreport', labReportSchema);
export default labReportModel;
