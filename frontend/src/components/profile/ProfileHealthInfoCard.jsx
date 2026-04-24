import React from 'react'

const ProfileHealthInfoCard = ({ userData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <h2 className="text-xs font-semibold tracking-wide text-[#6B7280] dark:text-gray-400 mb-4">
        HEALTH INFORMATION
      </h2>
      <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-3">
        This information is shared with your doctors to support informed care.
      </p>
      <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-3">
        Only your doctor can update this information.
      </p>
      <div className="space-y-4 text-sm text-[#1F2937] dark:text-gray-100">
        <div className="space-y-1.5">
          <span className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 block">Allergies</span>
          <span className="text-sm text-[#6B7280] dark:text-gray-300 block">
            {(userData.allergies && userData.allergies.length) ? userData.allergies.join(', ') : 'None specified'}
          </span>
        </div>
        <div className="space-y-1.5">
          <span className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 block">Chronic conditions</span>
          <span className="text-sm text-[#6B7280] dark:text-gray-300 block">
            {(userData.chronicConditions && userData.chronicConditions.length) ? userData.chronicConditions.join(', ') : 'None specified'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileHealthInfoCard
