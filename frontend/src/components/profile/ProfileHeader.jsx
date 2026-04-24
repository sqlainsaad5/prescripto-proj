import React from 'react'
import { assets } from '../../data/assets'

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const ProfileHeader = ({ userData, onEdit }) => {
  const initials = getInitials(userData?.name)

  return (
    <div className="relative">
      <div className="h-40 sm:h-52 rounded-2xl bg-gradient-to-r from-[#3B82F6] via-indigo-500 to-[#10B981] shadow-lg" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-black/10 via-transparent to-black/20" />

      <div className="relative px-5 sm:px-8 -mt-10 sm:-mt-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          <div className="relative inline-flex">
            {userData?.image ? (
              <img
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-xl bg-gray-200"
                src={userData.image}
                alt={userData.name}
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-gray-900 shadow-xl bg-[#3B82F6] flex items-center justify-center text-white text-2xl font-semibold">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1.5 shadow-md">
              <img src={assets.upload_icon} alt="Upload" className="w-5 h-5 opacity-80" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#1F2937] dark:text-white">
                {userData?.name}
              </h1>
              <p className="mt-1 text-sm text-[#6B7280] dark:text-gray-400">
                Welcome back, this is your personal profile overview.
              </p>
            </div>

            <div className="flex items-end justify-start sm:justify-end gap-3">
              <button
                className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-[#3B82F6] text-[#3B82F6] text-sm font-medium bg-white/90 dark:bg-gray-900/80 hover:bg-[#3B82F6] hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                onClick={onEdit}
              >
                Edit profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
