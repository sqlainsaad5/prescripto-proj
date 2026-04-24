import React, { useEffect, useState } from 'react'
import { assets } from '../../data/assets'
import { useSelector, useDispatch } from 'react-redux'
import { getDoctorAppointments, getDoctorProfile, completeAppointment, cancelDoctorAppointment, startVideoConsultation, joinDoctorVideoConsultation, endVideoConsultation } from '../../redux/slices/doctorSlice'
import { calculateAge, slotDateFormat } from '../../utils/helpers'
import PrescriptionForm from '../../components/PrescriptionForm'
import PatientHistoryModal from '../../components/PatientHistoryModal'
import FollowUpModal from '../../components/FollowUpModal'
import AppointmentActionCell from '../../components/doctor/AppointmentActionCell'

// Action column buttons: stay inside table cells (table-fixed + narrow col needs w-full + min-w-0)
const btnPrescription =
    'w-full min-w-0 max-w-full inline-flex items-center justify-center min-h-[2rem] px-2 py-1.5 text-xs font-medium leading-snug text-white text-center bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-1'
const btnFollowUp =
    'w-full min-w-0 max-w-full inline-flex items-center justify-center min-h-[2rem] px-2 py-1.5 text-xs font-medium leading-snug text-primary text-center bg-primary/5 border border-primary/30 rounded-md hover:bg-primary/10 hover:border-primary/45 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/25 focus:ring-offset-1'
const btnHistory =
    'w-full min-w-0 max-w-full inline-flex items-center justify-center min-h-[2rem] px-2 py-1.5 text-xs font-medium leading-snug text-slate-600 text-center bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/35 focus:ring-offset-1'

const DoctorAppointments = () => {
    const { appointments, dToken, profileData } = useSelector((state) => state.doctor)
    const { currency } = useSelector((state) => state.app)
    const dispatch = useDispatch()
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [appointmentForFollowUp, setAppointmentForFollowUp] = useState(null)

    useEffect(() => {
        if (dToken) {
            dispatch(getDoctorAppointments())
            dispatch(getDoctorProfile())
        }
    }, [dToken, dispatch])

    return (
        <div className='w-full max-w-6xl m-5'>
            <h2 className='mb-3 text-lg font-medium'> All Appointments</h2>
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll overflow-x-auto'>
                <table className='w-full min-w-[640px] table-fixed border-collapse'>
                    <colgroup>
                        <col className='w-[5%]' />
                        <col className='w-[18%]' />
                        <col className='w-[10%]' />
                        <col className='w-[8%]' />
                        <col className='w-[26%]' />
                        <col className='w-[10%]' />
                        <col className='w-[23%]' />
                    </colgroup>
                    <thead className='max-sm:hidden'>
                        <tr className='border-b'>
                            <th scope="col" className='py-3 px-6 text-left font-normal'>#</th>
                            <th scope="col" className='py-3 px-6 text-left font-normal'>Patient</th>
                            <th scope="col" className='py-3 px-6 text-left font-normal'>Payment</th>
                            <th scope="col" className='py-3 px-6 text-left font-normal'>Age</th>
                            <th scope="col" className='py-3 px-6 text-left font-normal'>Date & Time</th>
                            <th scope="col" className='py-3 px-6 text-left font-normal'>Fees</th>
                            <th scope="col" className='py-3 px-3 sm:px-4 text-left font-normal'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...appointments].reverse().map((item, index) => (
                            <tr key={item._id ?? index} className='text-gray-500 border-b hover:bg-gray-500'>
                                <td className='max-sm:hidden py-3 px-6 align-middle'>{index + 1}</td>
                                <td className='py-3 px-6 align-middle'>
                                    <div className='flex flex-col gap-1 min-w-0'>
                                        <div className='flex items-center gap-2 min-w-0'>
                                            <img className='w-8 shrink-0 rounded-full' src={item.userData.image} alt="" />
                                            <span className='truncate'>{item.userData.name}</span>
                                        </div>
                                        <span
                                            className={`self-start rounded border px-1.5 py-0.5 text-[10px] sm:text-xs ${
                                                item.consultationMode === 'video'
                                                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 bg-slate-50 text-slate-600'
                                            }`}
                                        >
                                            {item.consultationMode === 'video' ? 'Video' : 'In person'}
                                        </span>
                                    </div>
                                </td>
                                <td className='py-3 px-6 align-middle'>
                                    <span className='text-xs inline border border-primary px-2 rounded-full'>
                                        {item.payment ? 'Paid' : 'Cash'}
                                    </span>
                                </td>
                                <td className='max-sm:hidden py-3 px-6 align-middle'>{calculateAge(item.userData.dob)}</td>
                                <td className='py-3 px-6 align-middle'>{slotDateFormat(item.slotDate)},{item.slotTime}</td>
                                <td className='py-3 px-6 align-middle'>{currency}{item.amount}</td>
                                <td className='min-w-0 py-3 px-3 sm:px-4 align-top'>
                                    <AppointmentActionCell
                                        item={{ ...item, cancelIcon: assets.cancel_icon, tickIcon: assets.tick_icon }}
                                        btnHistory={btnHistory}
                                        btnPrescription={btnPrescription}
                                        btnFollowUp={btnFollowUp}
                                        onViewHistory={() => setSelectedPatient({ id: item.userId, name: item.userData?.name })}
                                        onOpenPrescription={() => { setSelectedAppointment(item); setShowPrescriptionForm(true); }}
                                        onOpenFollowUp={() => setAppointmentForFollowUp(item)}
                                        onCancel={() => dispatch(cancelDoctorAppointment(item._id))}
                                        onComplete={() => dispatch(completeAppointment(item._id))}
                                        onJoinVideo={() => dispatch(joinDoctorVideoConsultation(item._id))}
                                        onStartVideo={() => dispatch(startVideoConsultation(item._id))}
                                        onEndVideo={() => dispatch(endVideoConsultation(item._id))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            {appointmentForFollowUp && (
                <FollowUpModal
                    appointment={appointmentForFollowUp}
                    slotsBooked={profileData?.slots_booked}
                    onClose={() => setAppointmentForFollowUp(null)}
                    onSuccess={() => { dispatch(getDoctorAppointments()); dispatch(getDoctorProfile()); }}
                />
            )}
        </div>
    )
}

export default DoctorAppointments
