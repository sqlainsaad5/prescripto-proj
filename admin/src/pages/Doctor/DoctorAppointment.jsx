import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useSelector, useDispatch } from 'react-redux'
import { getDoctorAppointments, completeAppointment, cancelDoctorAppointment } from '../../store/slices/doctorSlice'
import { calculateAge, slotDateFormat } from '../../utils/helpers'
import PrescriptionForm from '../../components/PrescriptionForm'
import PatientHistoryModal from '../../components/PatientHistoryModal'

const DoctorAppointments = () => {
    const { appointments, dToken } = useSelector((state) => state.doctor)
    const { currency } = useSelector((state) => state.app)
    const dispatch = useDispatch()
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState(null)

    useEffect(() => {
        if (dToken) {
            dispatch(getDoctorAppointments())
        }
    }, [dToken, dispatch])
    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'> All Appointments</p>
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>
                {
                    [...appointments].reverse().map((item, index) => (
                        <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-500' key={index}>
                            <p className='max-sm:hidden'>{index + 1}</p>

                            <div className='flex items-center gap-2'>
                                <img className='w-8 rounded-full' src={item.userData.image} alt="" /><p>{item.userData.name}</p>
                            </div>
                            <div>
                                <p className='text-xs inline border border-primary px-2 rounded-full'>
                                    {item.payment ? "Paid" : "Cash"}
                                </p>
                            </div>
                            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
                            <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>
                            <p>{currency}{item.amount}</p>
                            {
                                item.cancelled
                                    ? <div className='flex flex-col gap-1 items-start'>
                                        <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPatient({ id: item.userId, name: item.userData?.name })}
                                            className='text-xs text-primary border border-primary px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors'
                                        >
                                            View History
                                        </button>
                                      </div>
                                    : item.isCompleted
                                        ? <div className='flex flex-col gap-1 items-start'>
                                            <p className='text-green-500 text-xs font-medium'>Completed</p>
                                            <button
                                                type="button"
                                                onClick={() => { setSelectedAppointment(item); setShowPrescriptionForm(true); }}
                                                className='text-xs text-primary border border-primary px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors'
                                            >
                                                Generate Prescription
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPatient({ id: item.userId, name: item.userData?.name })}
                                                className='text-xs text-gray-600 border border-gray-400 px-2 py-1 rounded hover:bg-gray-100 transition-colors'
                                            >
                                                View History
                                            </button>
                                          </div>
                                        : <div className='flex flex-col gap-1 items-start'>
                                            <div className='flex'>
                                                <img onClick={() => dispatch(cancelDoctorAppointment(item._id))} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                                                <img onClick={() => dispatch(completeAppointment(item._id))} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPatient({ id: item.userId, name: item.userData?.name })}
                                                className='text-xs text-gray-600 border border-gray-400 px-2 py-1 rounded hover:bg-gray-100 transition-colors'
                                            >
                                                View History
                                            </button>
                                        </div>
                            }

                            <div>

                            </div>
                        </div>

                    ))
                }
            </div>
            {showPrescriptionForm && selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <PrescriptionForm
                        appointment={selectedAppointment}
                        onCancel={() => { setShowPrescriptionForm(false); setSelectedAppointment(null); }}
                        onSubmitSuccess={() => { setShowPrescriptionForm(false); setSelectedAppointment(null); dispatch(getDoctorAppointments()); }}
                    />
                </div>
            )}
            {selectedPatient && (
                <PatientHistoryModal
                    patientId={selectedPatient.id}
                    patientName={selectedPatient.name}
                    onClose={() => setSelectedPatient(null)}
                />
            )}
        </div>
    )
}

export default DoctorAppointments