import React from 'react'

const ProfileContactCard = ({ userData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <h2 className="text-xs font-semibold tracking-wide text-[#6B7280] dark:text-gray-400 mb-4">
        CONTACT INFORMATION
      </h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/40 dark:text-blue-300 text-base">
            📧
          </span>
          <div>
            <span className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 block">Email</span>
            <span className="text-sm font-medium text-[#3B82F6] break-all block">{userData.email}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#10B981] dark:bg-emerald-900/40 dark:text-emerald-300 text-base">
            📱
          </span>
          <div>
            <span className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 block">Phone</span>
            <span className="text-sm text-[#3B82F6] block">{userData.phone || 'Not added'}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-500 dark:bg-purple-900/40 dark:text-purple-300 text-base">
            📍
          </span>
          <div className="w-full">
            <span className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 block">Address</span>
            <p className="mt-1 text-sm text-[#6B7280] dark:text-gray-300 whitespace-pre-line">
              {userData.address?.line1 || 'Not added'}
              {userData.address?.line2 ? '\n' + userData.address.line2 : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileContactCard
