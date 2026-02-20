import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDoctorProfile, updateDoctorProfile } from '../../store/slices/doctorSlice'

const DoctorProfile = () => {
    const { dToken, profileData } = useSelector((state) => state.doctor)
    const { currency } = useSelector((state) => state.app)
    const dispatch = useDispatch()

    const [isEdit, setIsEdit] = useState(false)
    const [editData, setEditData] = useState(null)

    const handleUpdateProfile = async () => {
        const resultAction = await dispatch(updateDoctorProfile(editData))
        if (updateDoctorProfile.fulfilled.match(resultAction)) {
            setIsEdit(false)
        }
    }

    useEffect(() => {
        if (dToken) {
            dispatch(getDoctorProfile())
        }
    }, [dToken, dispatch])

    useEffect(() => {
        if (profileData) {
            setEditData(profileData)
        }
    }, [profileData])

    return profileData && editData && (
        <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
                </div>
                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                    {/*Doc info :name,degree,experience */}
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree}-  {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
                    </div>
                    {/*------Doc About-------- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-800 mt-3' >About:</p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {profileData.about}
                        </p>
                    </div>
                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-800'>{currency}{isEdit ? <input type="number" onChange={(e) => setEditData(prev => ({ ...prev, fee: e.target.value }))} value={editData.fee} /> : profileData.fee}</span>
                    </p>

                    <div className='flex gap-2 py-2'>
                        <p>Address:</p>
                        <p className='text-sm'>
                            {isEdit ? <input type="text" onChange={(e) => setEditData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={editData.address.line1} /> : profileData.address.line1}
                            <br />
                            {isEdit ? <input type="text" onChange={(e) => setEditData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={editData.address.line2} /> : profileData.address.line2}

                        </p>
                    </div>
                    <div className='flex gap-1 pt-2'>
                        <input onChange={() => isEdit && setEditData(prev => ({ ...prev, available: !prev.available }))} checked={isEdit ? editData.available : profileData.available} type="checkbox" name="" />
                        <label htmlFor="">Available</label>
                    </div>
                    {
                        isEdit
                            ? <button onClick={handleUpdateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>
                            : <button onClick={() => setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>
                    }

                </div>

            </div>

        </div>
    )
}

export default DoctorProfile