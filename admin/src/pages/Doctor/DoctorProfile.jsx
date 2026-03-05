import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDoctorProfile, updateDoctorProfile } from '../../store/slices/doctorSlice'

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

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

  // Loading skeleton
  if (!profileData || !editData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl space-y-6">
          <div className="h-44 rounded-2xl bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200 animate-pulse" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-64 rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-sm animate-pulse md:col-span-2" />
            <div className="h-64 rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const initials = getInitials(profileData.name)
  const rating = profileData.rating || 4.8

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-150 p-6 sm:p-8 space-y-6">
          {/* Header: avatar + name + speciality */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center">
            {/* Avatar with verified badge */}
            <div className="relative">
              {profileData.image ? (
                <img
                  src={profileData.image}
                  alt={profileData.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg bg-gray-200"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg bg-[#3B82F6] flex items-center justify-center text-white text-2xl font-semibold">
                  {initials}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white text-[11px] font-medium px-2 py-1 shadow-md">
                <span className="text-xs">✔</span>
                <span>Verified</span>
              </span>
            </div>

            {/* Main header text */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {profileData.name}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {profileData.degree} · {profileData.speciality}
                  </p>

                  {/* Rating + experience (visual only) */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="font-medium text-gray-800">
                        {rating.toFixed(1)}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                      ⏱
                      <span className="font-medium">
                        {profileData.experience}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Edit / Save button */}
                <div className="flex sm:justify-end">
                  {isEdit ? (
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 rounded-full bg-[#3B82F6] text-white text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-[#2563EB] transition-all duration-150"
                    >
                      Save changes
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEdit(true)}
                      className="px-4 py-2 rounded-full border border-[#3B82F6] text-[#3B82F6] text-xs sm:text-sm font-medium bg-white hover:bg-[#3B82F6] hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    >
                      Edit profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* About */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-500 tracking-wide">
              ABOUT
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">
              {profileData.about || 'This doctor has not added a detailed bio yet.'}
            </p>
          </section>

          {/* Practice details */}
          <section className="grid gap-6 sm:grid-cols-2 text-sm text-gray-800">
            {/* Appointment fee */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 tracking-wide">
                APPOINTMENT FEE
              </h3>
              <p className="text-sm text-gray-700">
                {currency}
                {isEdit ? (
                  <input
                    type="number"
                    value={editData.fee}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        fee: e.target.value,
                      }))
                    }
                    className="ml-2 w-24 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                ) : (
                  profileData.fee
                )}
              </p>
            </div>

            {/* Availability toggle */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 tracking-wide">
                AVAILABILITY
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  checked={isEdit ? editData.available : profileData.available}
                  onChange={() =>
                    isEdit &&
                    setEditData((prev) => ({
                      ...prev,
                      available: !prev.available,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                />
                <span className="text-sm text-gray-700">
                  {isEdit
                    ? editData.available
                      ? 'Available for appointments'
                      : 'Not available'
                    : profileData.available
                    ? 'Available for appointments'
                    : 'Not available'}
                </span>
              </div>
            </div>
          </section>

          {/* Address (full width) */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 tracking-wide">
              CLINIC ADDRESS
            </h3>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editData.address?.line1 || ''}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      address: {
                        ...(prev.address || {}),
                        line1: e.target.value,
                      },
                    }))
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  placeholder="Address line 1"
                />
                <input
                  type="text"
                  value={editData.address?.line2 || ''}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      address: {
                        ...(prev.address || {}),
                        line2: e.target.value,
                      },
                    }))
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  placeholder="Address line 2"
                />
              </div>
            ) : (
              <p className="whitespace-pre-line text-sm text-gray-700">
                {profileData.address?.line1}
                {profileData.address?.line2
                  ? '\n' + profileData.address.line2
                  : ''}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile