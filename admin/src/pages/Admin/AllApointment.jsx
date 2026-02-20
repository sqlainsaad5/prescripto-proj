import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useSelector, useDispatch } from 'react-redux'
import { getAllAppointments, cancelAppointment } from '../../store/slices/adminSlice'
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
      <p className='mb-3 text-lg font-medium'>All Appointmenst</p>
      <div className='bg-white border border-gray-200 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Payment</p>
          <p>Actions</p>

        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name}</p>

            </div>
            <p>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="" /> <p>{item.docData.name}</p>

            </div>
            <p>{currency}{item.amount}</p>
            <p className={`text-xs font-medium ${item.payment ? 'text-green-500' : 'text-orange-400'}`}>
              {item.payment ? 'Paid' : 'Pending'}
            </p>
            {
              item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : <img onClick={() => dispatch(cancelAppointment(item._id))} className='w-18 cursor-pointer' src={assets.cancel_icon} alt="" />
            }

          </div>

        ))}

      </div>
    </div>
  )
}

export default AllApointment
