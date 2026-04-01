import React from 'react'

const ProfileBasicInfoCard = ({ userData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <h2 className="text-xs font-semibold tracking-wide text-[#6B7280] dark:text-gray-400 mb-4">
        BASIC INFORMATION
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 text-sm text-[#1F2937] dark:text-gray-100">
        <div className="space-y-1.5">
          <span className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 block">Gender</span>
          <span className="text-sm text-[#6B7280] dark:text-gray-300 block">{userData.gender || 'Not specified'}</span>
        </div>
        <div className="space-y-1.5">
          <span className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 block">Birthday</span>
          <span className="text-sm text-[#6B7280] dark:text-gray-300 block">{userData.dob || 'Not specified'}</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileBasicInfoCard
