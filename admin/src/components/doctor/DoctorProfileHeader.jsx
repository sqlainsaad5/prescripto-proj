import React from 'react'

const DoctorProfileHeader = ({ profileData, initials, rating, isEdit, onEdit, onSave }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center">
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

      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{profileData.name}</h1>
            <div className="mt-1 text-sm text-gray-600">
              {profileData.degree} · {profileData.speciality}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                <span className="text-yellow-500">★★★★★</span>
                <span className="font-medium text-gray-800">{rating.toFixed(1)}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                ⏱
                <span className="font-medium">{profileData.experience}</span>
              </span>
            </div>
          </div>

          <div className="flex sm:justify-end">
            {isEdit ? (
              <button onClick={onSave} className="px-4 py-2 rounded-full bg-[#3B82F6] text-white text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-[#2563EB] transition-all duration-150">Save changes</button>
            ) : (
              <button onClick={onEdit} className="px-4 py-2 rounded-full border border-[#3B82F6] text-[#3B82F6] text-xs sm:text-sm font-medium bg-white hover:bg-[#3B82F6] hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">Edit profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfileHeader
