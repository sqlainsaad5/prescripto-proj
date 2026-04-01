import React, { useEffect } from 'react'
import { assets } from '../../data/assets'
import { useSelector, useDispatch } from 'react-redux'
import { getDoctorDashData, completeAppointment, cancelDoctorAppointment } from '../../redux/slices/doctorSlice'
import { slotDateFormat } from '../../utils/helpers'

const DoctorDashboard = () => {
    const { dToken, dashData } = useSelector((state) => state.doctor)
    const { currency } = useSelector((state) => state.app)
    const dispatch = useDispatch()

    useEffect(() => {
        if (dToken) {
            dispatch(getDoctorDashData())
        }
    }, [dToken, dispatch])
    return dashData && (
        <div className='m-5'>
            <div className='flex flex-wrap gap-3'>
                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.earning_icon} alt="" />
                    <div>
                        <span className='text-xl font-semibold text-gray-600'>{currency}{dashData.earnings}</span>
                        <span className='text-gray-400'>Earnings</span>
                    </div>
                </div>
                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.appointments_icon} alt="" />
                    <div>
                        <span className='text-xl font-semibold text-gray-600'>{dashData.appointments}</span>
                        <span className='text-gray-400'>Appointments</span>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <span className='text-xl font-semibold text-gray-600'>{dashData.patients}</span>
                        <span className='text-gray-400'>Patients</span>
                    </div>
                </div>
            </div>
            <div className='bg-white'>
                <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
                    <img src={assets.list_icon} alt="" />
                    <h2 className='font-semibold'>Latest Booking</h2>
                </div>
                <div className='pt-4 border border-t-0'>
                    {
                        dashData.latestAppointments.map((item, index) => (
                            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                                <img className='rounded-full w-10' src={item.userData.image} alt="" />
                                <div className='flex-1 text-sm'>
                                    <span className='text-gray-800 font-medium'>{item.userData.name}</span>
                                    <span className='text-gray-600'>{slotDateFormat(item.slotDate)}</span>
                                </div>
                                {
                                    item.cancelled
                                        ? <span className='text-red-400 text-xs font-medium'>Cancelled</span>
                                        : item.isCompleted
                                            ? <span className='text-green-500 text-xs font-medium'>Completed</span>
                                            : <div className='flex'>
                                                <img onClick={() => dispatch(cancelDoctorAppointment(item._id))} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                                                <img onClick={() => dispatch(completeAppointment(item._id))} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />

                                            </div>
                                }
                            </div>
                        ))
                    }

                </div>
            </div>

        </div>
    )
}

export default DoctorDashboard