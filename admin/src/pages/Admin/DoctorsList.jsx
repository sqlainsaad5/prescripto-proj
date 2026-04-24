import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllDoctors, changeAvailability } from '../../redux/slices/adminSlice'

const DoctorsList = () => {
  const { doctors, aToken } = useSelector((state) => state.admin)
  const dispatch = useDispatch()

  useEffect(() => {
    if (aToken) {
      dispatch(getAllDoctors())
    }
  }, [aToken, dispatch])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item, index) => (
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
              <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
              <div className='p-4'>
                <h2 className='text-neutral-800 text-lg-font-medium'>{item.name}</h2>
                <span className='text-zinc-600 text-sm'>{item.speciality}</span>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input onChange={() => dispatch(changeAvailability(item._id))} type="checkbox" checked={item.available} />
                  <span>Available</span>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList
