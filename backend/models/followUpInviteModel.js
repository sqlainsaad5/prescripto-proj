import mongoose from 'mongoose';

const followUpInviteSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    sourceAppointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
    token: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'completed', 'expired'], default: 'pending' },
    createdAt: { type: Number, required: true }
});

followUpInviteSchema.index({ token: 1 }, { unique: true });

const followUpInviteModel = mongoose.models.followUpInvite || mongoose.model('followUpInvite', followUpInviteSchema);
export default followUpInviteModel;
