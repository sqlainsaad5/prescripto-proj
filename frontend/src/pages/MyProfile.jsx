import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserProfile } from '../store/slices/userSlice'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileContactCard from '../components/profile/ProfileContactCard'
import ProfileBasicInfoCard from '../components/profile/ProfileBasicInfoCard'
import ProfileHealthInfoCard from '../components/profile/ProfileHealthInfoCard'
import EditProfileModal from '../components/profile/EditProfileModal'

const MyProfile = () => {
  const { userData, token } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const updateUserProfileData = async (editData, image) => {
    try {
      setIsSaving(true)
      const resultAction = await dispatch(
        updateUserProfile({ editData, image })
      )
      if (updateUserProfile.fulfilled.match(resultAction)) {
        setIsEditOpen(false)
      }
    } catch (error) {
      // errors are already handled inside the thunk
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  // Loading skeleton
  if (!userData) {
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <ProfileHeader userData={userData} onEdit={() => setIsEditOpen(true)} />

        {/* Details */}
        <div className="space-y-6">
          {/* Contact + basic info */}
          <div className="space-y-6">
            <ProfileContactCard userData={userData} />
            <ProfileBasicInfoCard userData={userData} />
            <ProfileHealthInfoCard userData={userData} />
          </div>
        </div>
      </div>
      {isEditOpen && (
        <EditProfileModal
          userData={userData}
          saving={isSaving}
          onClose={() => setIsEditOpen(false)}
          onSave={updateUserProfileData}
        />
      )}
    </div>
  )
}

export default MyProfile
