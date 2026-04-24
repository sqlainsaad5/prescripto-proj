import React from 'react'
import { assets } from '../data/assets'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Sidebar = () => {

    const { aToken } = useSelector((state) => state.admin)
    const { dToken } = useSelector((state) => state.doctor)

    return (
        <div className='min-h-screen bg-white border-r border-gray-200'>
            {
                aToken && <ul className='text-[#515151] mt-5'>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/admin-dashboard'}>
                        <img src={assets.home_icon} alt="" />
                        <span className='hidden md:block'>Dashboard</span>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'all-appointment'}>
                        <img src={assets.appointment_icon} alt="" />
                        <span className='hidden md:block'>Appointment</span>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/add-doctor'}>
                        <img src={assets.add_icon} alt="" />
                        <span className='hidden md:block'>Add Doctor</span>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/doctor-list'}>
                        <img src={assets.people_icon} alt="" />
                        <span className='hidden md:block'>Doctors List</span>
                    </NavLink>
                </ul>
            }

            {
                (dToken && !aToken) && <ul className='text-[#515151] mt-5'>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/doctor-dashboard'}>
                        <img src={assets.home_icon} alt="" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/doctor-appointment'}>
                        <img src={assets.appointment_icon} alt="" />
                        <span>Appointment</span>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/doctor-profile'}>
                        <img src={assets.people_icon} alt="" />
                        <span>Profiles</span>
                    </NavLink>
                </ul>
            }

        </div>
    )
}

export default Sidebar
