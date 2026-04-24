import React, { useEffect } from 'react'
import { assets } from '../../data/assets'
import { useSelector, useDispatch } from 'react-redux'
import { getAllAppointments, cancelAppointment } from '../../redux/slices/adminSlice'
import { calculateAge, slotDateFormat } from '../../utils/helpers'

const AllApointment = () => {
  const { aToken, appointments } = useSelector((state) => state.admin)
  const { currency } = useSelector((state) => state.app)
  const dispatch = useDispatch()

  useEffect(() => {
    if (aToken) {
      dispatch(getAllAppointments())
    }
  }, [aToken, dispatch])

  return (
    <div className='w-full max-w-6xl m-5'>
      <h2 className='mb-3 text-lg font-medium'>All Appointmenst</h2>
      <div className='bg-white border border-gray-200 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <span>#</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Date & Time</span>
          <span>Doctor</span>
          <span>Fees</span>
          <span>Payment</span>
          <span>Actions</span>

        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <span className='max-sm:hidden'>{index + 1}</span>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="" /> <span>{item.userData.name}</span>

            </div>
            <span>{calculateAge(item.userData.dob)}</span>
            <span>{slotDateFormat(item.slotDate)},{item.slotTime}</span>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="" /> <span>{item.docData.name}</span>

            </div>
            <span>{currency}{item.amount}</span>
            <span className={`text-xs font-medium ${item.payment ? 'text-green-500' : 'text-orange-400'}`}>
              {item.payment ? 'Paid' : 'Pending'}
            </span>
            {
              item.cancelled
                ? <span className='text-red-400 text-xs font-medium'>Cancelled</span>
                : <img onClick={() => dispatch(cancelAppointment(item._id))} className='w-18 cursor-pointer' src={assets.cancel_icon} alt="" />
            }

          </div>

        ))}

      </div>
    </div>
  )
}

export default AllApointment
