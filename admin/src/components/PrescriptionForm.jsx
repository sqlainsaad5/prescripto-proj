import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createPrescription } from '../store/slices/doctorSlice';

const PrescriptionForm = ({ appointment, onSubmitSuccess, onCancel }) => {
    const dispatch = useDispatch();
    const [medicines, setMedicines] = useState([
        { medicineName: '', dosage: '', duration: '', instructions: '' }
    ]);
    const [submitting, setSubmitting] = useState(false);

    const addMedicine = () => {
        setMedicines([...medicines, { medicineName: '', dosage: '', duration: '', instructions: '' }]);
    };

    const removeMedicine = (index) => {
        if (medicines.length <= 1) return;
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const updateMedicine = (index, field, value) => {
        const updated = [...medicines];
        updated[index] = { ...updated[index], [field]: value };
        setMedicines(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = medicines.filter(m => m.medicineName.trim() && m.dosage.trim() && m.duration.trim());
        if (valid.length === 0) {
            toast.error('Add at least one medicine with name, dosage and duration.');
            return;
        }
        setSubmitting(true);
        const resultAction = await dispatch(createPrescription({
            appointmentId: appointment._id,
            medicines: valid
        }));
        setSubmitting(false);
        if (createPrescription.fulfilled.match(resultAction)) {
            onSubmitSuccess();
        }
    };

    if (!appointment) return null;

    return (
        <div className="bg-white px-8 py-8 border rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto border-gray-300">
            <p className="mb-4 text-lg font-medium text-gray-700">
                Prescription for {appointment.userData?.name || 'Patient'}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {medicines.map((med, index) => (
                    <div key={index} className="border border-gray-200 rounded p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Medicine {index + 1}</span>
                            {medicines.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMedicine(index)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-600 text-sm">Medicine Name</p>
                            <input
                                value={med.medicineName}
                                onChange={(e) => updateMedicine(index, 'medicineName', e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                                type="text"
                                placeholder="e.g. Paracetamol 500mg"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-600 text-sm">Dosage</p>
                                <input
                                    value={med.dosage}
                                    onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                                    type="text"
                                    placeholder="e.g. 1 tablet"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-600 text-sm">Duration</p>
                                <input
                                    value={med.duration}
                                    onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                                    type="text"
                                    placeholder="e.g. 7 days"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-600 text-sm">Special Instructions / Notes</p>
                            <textarea
                                value={med.instructions}
                                onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                                rows={2}
                                placeholder="After meals, etc."
                            />
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addMedicine}
                    className="text-primary border border-primary rounded px-4 py-2 text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                >
                    Add medicine
                </button>
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-primary px-10 py-3 text-white rounded-full disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : 'Save Prescription'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="border border-gray-300 px-10 py-3 text-gray-700 rounded-full hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrescriptionForm;
