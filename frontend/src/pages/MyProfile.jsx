import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { assets } from '../assets/assets'
import { updateUserProfile } from '../store/slices/userSlice'

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const MyProfile = () => {
  const { userData, token } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(null)
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    if (userData) {
      setEditData({
        ...userData,
        allergies: Array.isArray(userData.allergies) ? userData.allergies : [],
        chronicConditions: Array.isArray(userData.chronicConditions) ? userData.chronicConditions : [],
        healthHistory: Array.isArray(userData.healthHistory) ? userData.healthHistory : [],
      })
    }
  }, [userData])

  const updateUserProfileData = async () => {
    try {
      const resultAction = await dispatch(
        updateUserProfile({ editData, image })
      )
      if (updateUserProfile.fulfilled.match(resultAction)) {
        setIsEdit(false)
        setImage(null)
      }
    } catch (error) {
      // errors are already handled inside the thunk
      console.log(error)
    }
  }

  // Loading skeleton
  if (!userData || !editData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl space-y-6">
          <div className="h-40 sm:h-52 rounded-2xl bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200 animate-pulse" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-40 rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-sm animate-pulse" />
            <div className="h-40 rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-sm animate-pulse md:col-span-2" />
          </div>
          <div className="h-56 rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-sm animate-pulse" />
        </div>
      </div>
    )
  }

  const initials = getInitials(userData.name)

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Cover + header */}
        <div className="relative">
          <div className="h-40 sm:h-52 rounded-2xl bg-gradient-to-r from-[#3B82F6] via-indigo-500 to-[#10B981] shadow-lg" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-black/10 via-transparent to-black/20" />

          <div className="relative px-5 sm:px-8 -mt-10 sm:-mt-14">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Avatar */}
              <label
                htmlFor={isEdit ? 'image' : undefined}
                className={isEdit ? 'cursor-pointer' : 'cursor-default'}
              >
                <div className="relative inline-flex">
                  {image || editData.image || userData.image ? (
                    <img
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-xl bg-gray-200"
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : editData.image || userData.image
                      }
                      alt={userData.name}
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-gray-900 shadow-xl bg-[#3B82F6] flex items-center justify-center text-white text-2xl font-semibold">
                      {initials}
                    </div>
                  )}

                  {isEdit && (
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1.5 shadow-md">
                      <img
                        src={assets.upload_icon}
                        alt="Upload"
                        className="w-5 h-5 opacity-80"
                      />
                    </div>
                  )}
                </div>
                {isEdit && (
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    id="image"
                    hidden
                  />
                )}
              </label>

              {/* Basic info + Edit button */}
              <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[#1F2937] dark:text-white">
                    {isEdit ? (
                      <input
                        className="mt-1 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-lg text-[#1F2937] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      userData.name
                    )}
                  </h1>
                  <p className="mt-1 text-sm text-[#6B7280] dark:text-gray-400">
                    Welcome back, this is your personal profile overview.
                  </p>
                </div>

                <div className="flex items-end justify-start sm:justify-end gap-3">
                  {isEdit ? (
                    <button
                      className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#3B82F6] text-white text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
                      onClick={updateUserProfileData}
                    >
                      Save changes
                    </button>
                  ) : (
                    <button
                      className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-[#3B82F6] text-[#3B82F6] text-sm font-medium bg-white/90 dark:bg-gray-900/80 hover:bg-[#3B82F6] hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      onClick={() => setIsEdit(true)}
                    >
                      Edit profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Contact + basic info */}
          <div className="space-y-6">
            {/* Contact info card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <p className="text-xs font-semibold tracking-wide text-[#6B7280] dark:text-gray-400 mb-4">
                CONTACT INFORMATION
              </p>
              <div className="space-y-3 text-sm">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/40 dark:text-blue-300 text-base">
                    📧
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-sm font-medium text-[#3B82F6] break-all">
                      {userData.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#10B981] dark:bg-emerald-900/40 dark:text-emerald-300 text-base">
                    📱
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400">
                      Phone
                    </p>
                    {isEdit ? (
                      <input
                        className="mt-1 w-48 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-[#1F2937] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                        type="text"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="text-sm text-[#3B82F6]">
                        {userData.phone || 'Not added'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-500 dark:bg-purple-900/40 dark:text-purple-300 text-base">
                    📍
                  </span>
                  <div className="w-full">
                    <p className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400">
                      Address
                    </p>
                    {isEdit ? (
                      <div className="mt-1 space-y-2">
                        <input
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-[#1F2937] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                          type="text"
                          placeholder="Address line 1"
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
                        />
                        <input
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-[#1F2937] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                          type="text"
                          placeholder="Address line 2"
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
                        />
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-[#6B7280] dark:text-gray-300 whitespace-pre-line">
                        {userData.address?.line1 || 'Not added'}
                        {userData.address?.line2
                          ? '\n' + userData.address.line2
                          : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic info card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <p className="text-xs font-semibold tracking-wide text-[#6B7280] dark:text-gray-400 mb-4">
                BASIC INFORMATION
              </p>
              <div className="grid gap-4 sm:grid-cols-2 text-sm text-[#1F2937] dark:text-gray-100">
                {/* Gender */}
                <div className="space-y-1.5">
                  <p className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400">
                    Gender
                  </p>
                  {isEdit ? (
                    <select
                      className="w-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      value={editData.gender}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-sm text-[#6B7280] dark:text-gray-300">
                      {userData.gender || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Birthday */}
                <div className="space-y-1.5">
                  <p className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400">
                    Birthday
                  </p>
                  {isEdit ? (
                    <input
                      className="w-40 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      type="date"
                      value={editData.dob}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          dob: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="text-sm text-[#6B7280] dark:text-gray-300">
                      {userData.dob || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Health information (EHR) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <p className="text-xs font-semibold tracking-wide text-[#6B7280] dark:text-gray-400 mb-4">
                HEALTH INFORMATION
              </p>
              <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-3">
                This information is shared with your doctors to support informed care.
              </p>
              <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-3">
                Only your doctor can update this information.
              </p>
              <div className="space-y-4 text-sm text-[#1F2937] dark:text-gray-100">
                <div className="space-y-1.5">
                  <p className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400">
                    Allergies
                  </p>
                  <p className="text-sm text-[#6B7280] dark:text-gray-300">
                    {(userData.allergies && userData.allergies.length) ? userData.allergies.join(', ') : 'None specified'}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400">
                    Chronic conditions
                  </p>
                  <p className="text-sm text-[#6B7280] dark:text-gray-300">
                    {(userData.chronicConditions && userData.chronicConditions.length) ? userData.chronicConditions.join(', ') : 'None specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
