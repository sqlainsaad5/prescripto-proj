import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getPatientHistory, updatePatientHealth } from '../store/slices/doctorSlice';

const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const labReportTypeLabel = (type) => {
    const labels = { xray: 'X-ray', blood_test: 'Blood test', diagnostic: 'Diagnostic document' };
    return labels[type] || type;
};

const parseCommaList = (str) => (str || '').split(',').map((s) => s.trim()).filter(Boolean);

const PatientHistoryModal = ({ patientId, patientName, onClose }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isEditingHealth, setIsEditingHealth] = useState(false);
    const [editAllergies, setEditAllergies] = useState('');
    const [editChronicConditions, setEditChronicConditions] = useState('');
    const [savingHealth, setSavingHealth] = useState(false);

    useEffect(() => {
        if (!patientId) return;
        setLoading(true);
        setError(null);
        dispatch(getPatientHistory(patientId))
            .then((result) => {
                if (getPatientHistory.fulfilled.match(result)) {
                    setData(result.payload);
                } else {
                    setError(result.error?.message || 'Failed to load history');
                }
            })
            .finally(() => setLoading(false));
    }, [patientId, dispatch]);

    if (!patientId) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto border-gray-300 flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <p className="text-lg font-medium text-gray-700">
                        Patient History – {patientName || 'Patient'}
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
                <div className="px-6 py-4 flex-1 overflow-y-auto">
                    {loading && (
                        <p className="text-gray-500 text-sm">Loading patient history...</p>
                    )}
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    {!loading && !error && data && (
                        <div className="space-y-5">
                            {/* Allergies & Chronic conditions – doctor can edit */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-semibold tracking-wide text-gray-500">ALLERGIES / CHRONIC CONDITIONS</p>
                                    {!isEditingHealth ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditAllergies((data.patient?.allergies || []).join(', '));
                                                setEditChronicConditions((data.patient?.chronicConditions || []).join(', '));
                                                setIsEditingHealth(true);
                                            }}
                                            className="text-primary border border-primary px-2 py-1 rounded text-xs font-medium hover:bg-primary hover:text-white transition-colors"
                                        >
                                            Update health info
                                        </button>
                                    ) : null}
                                </div>
                                {!isEditingHealth ? (
                                    <>
                                        <p className="text-xs text-gray-500 mb-1">Allergies</p>
                                        {data.patient?.allergies?.length > 0 ? (
                                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
                                                {data.patient.allergies.map((a, i) => (
                                                    <li key={i}>{a}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500 mb-3">None recorded</p>
                                        )}
                                        <p className="text-xs text-gray-500 mb-1">Chronic conditions</p>
                                        {data.patient?.chronicConditions?.length > 0 ? (
                                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                                {data.patient.chronicConditions.map((c, i) => (
                                                    <li key={i}>{c}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">None recorded</p>
                                        )}
                                    </>
                                ) : (
                                    <div className="space-y-3 border border-gray-200 rounded p-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Allergies (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={editAllergies}
                                                onChange={(e) => setEditAllergies(e.target.value)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
                                                placeholder="e.g. Penicillin, Nuts"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Chronic conditions (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={editChronicConditions}
                                                onChange={(e) => setEditChronicConditions(e.target.value)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
                                                placeholder="e.g. Diabetes, Hypertension"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                disabled={savingHealth}
                                                onClick={async () => {
                                                    setSavingHealth(true);
                                                    const result = await dispatch(updatePatientHealth({
                                                        patientId,
                                                        allergies: parseCommaList(editAllergies),
                                                        chronicConditions: parseCommaList(editChronicConditions),
                                                    }));
                                                    setSavingHealth(false);
                                                    if (updatePatientHealth.fulfilled.match(result)) {
                                                        setIsEditingHealth(false);
                                                        const refetch = await dispatch(getPatientHistory(patientId));
                                                        if (getPatientHistory.fulfilled.match(refetch)) {
                                                            setData(refetch.payload);
                                                        }
                                                    }
                                                }}
                                                className="bg-primary text-white px-3 py-1.5 rounded text-sm font-medium disabled:opacity-50"
                                            >
                                                {savingHealth ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingHealth(false)}
                                                className="border border-gray-300 px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Health history (previous diagnosis notes) */}
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-gray-500 mb-2">HEALTH HISTORY / PREVIOUS DIAGNOSIS</p>
                                {data.patient?.healthHistory?.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.patient.healthHistory.map((h, i) => (
                                            <div key={i} className="border border-gray-200 rounded p-3 text-sm text-gray-700">
                                                <p className="text-gray-500 text-xs mb-1">{formatDate(h.date)}</p>
                                                <p>{h.note || '—'}</p>
                                                {h.fileUrl && (
                                                    <a href={h.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-xs mt-1 inline-block">
                                                        View document
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">None recorded</p>
                                )}
                            </div>

                            {/* Past prescriptions */}
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-gray-500 mb-2">PAST PRESCRIPTIONS</p>
                                {data.prescriptions?.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.prescriptions.map((rx) => (
                                            <div key={rx._id} className="border border-gray-200 rounded p-3 text-sm text-gray-700">
                                                <p className="text-gray-500 text-xs mb-2">{formatDate(rx.prescriptionDate)}</p>
                                                {rx.notes && (
                                                    <p className="text-gray-600 mb-2 italic">{rx.notes}</p>
                                                )}
                                                <ul className="space-y-1">
                                                    {rx.medicines?.map((m, i) => (
                                                        <li key={i}>
                                                            {m.medicineName} – {m.dosage}, {m.duration}
                                                            {m.instructions ? ` (${m.instructions})` : ''}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No past prescriptions</p>
                                )}
                            </div>

                            {/* Lab reports */}
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-gray-500 mb-2">LAB REPORTS</p>
                                {data.labReports?.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.labReports.map((report) => (
                                            <div key={report._id} className="border border-gray-200 rounded p-3 text-sm text-gray-700 flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <p className="font-medium">{labReportTypeLabel(report.type)}</p>
                                                    <p className="text-gray-500 text-xs">{formatDate(report.uploadedAt)}</p>
                                                    {report.fileName && <p className="text-gray-500 text-xs truncate max-w-xs">{report.fileName}</p>}
                                                </div>
                                                <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary border border-primary px-2 py-1 rounded text-xs font-medium hover:bg-primary hover:text-white transition-colors shrink-0">
                                                    View
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No lab reports uploaded</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientHistoryModal;
