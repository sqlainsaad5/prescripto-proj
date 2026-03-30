import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    consultationMode: { type: String, enum: ['in_person', 'video'], default: 'in_person' },
    videoProvider: { type: String, default: null },
    videoRoomId: { type: String, default: null },
    videoStatus: { type: String, enum: ['not_started', 'live', 'ended'], default: 'not_started' },
    callStartedAt: { type: Number, default: null },
    callEndedAt: { type: Number, default: null }
})

// Ensure a doctor can have only one active (non-cancelled) appointment
// for a given date and time slot.
appointmentSchema.index(
    { docId: 1, slotDate: 1, slotTime: 1 },
    {
        unique: true,
        partialFilterExpression: { cancelled: false }
    }
)

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)
export default appointmentModel