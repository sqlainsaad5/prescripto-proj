import React, { useEffect, useMemo, useState } from 'react'
import { assets } from '../../data/assets'

const normalizeUserData = (userData) => ({
  ...userData,
  allergies: Array.isArray(userData?.allergies) ? userData.allergies : [],
  chronicConditions: Array.isArray(userData?.chronicConditions) ? userData.chronicConditions : [],
  healthHistory: Array.isArray(userData?.healthHistory) ? userData.healthHistory : [],
})

const EditProfileModal = ({ userData, onClose, onSave, saving }) => {
  const [image, setImage] = useState(null)
  const [editData, setEditData] = useState(() => normalizeUserData(userData))

  useEffect(() => {
    setEditData(normalizeUserData(userData))
    setImage(null)
  }, [userData])

  const previewImage = useMemo(() => {
    if (image) return URL.createObjectURL(image)
    return editData.image || userData.image
  }, [image, editData.image, userData.image])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1F2937] dark:text-gray-100">Edit Profile</h2>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <div className="space-y-5">
          <label htmlFor="profile-image" className="inline-flex cursor-pointer items-center gap-3">
            <img
              className="w-20 h-20 rounded-full object-cover border border-gray-200 bg-gray-100"
              src={previewImage}
              alt={userData.name}
            />
            <span className="text-sm text-[#3B82F6] inline-flex items-center gap-2">
              <img src={assets.upload_icon} alt="" className="w-4 h-4" />
              Change photo
            </span>
          </label>
          <input id="profile-image" type="file" hidden onChange={(e) => setImage(e.target.files[0])} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="text-sm text-gray-600 block mb-1">Name</label>
              <input id="profile-name" className="w-full border rounded-lg px-3 py-2" value={editData.name || ''} onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="profile-phone" className="text-sm text-gray-600 block mb-1">Phone</label>
              <input id="profile-phone" className="w-full border rounded-lg px-3 py-2" value={editData.phone || ''} onChange={(e) => setEditData((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="profile-gender" className="text-sm text-gray-600 block mb-1">Gender</label>
              <select id="profile-gender" className="w-full border rounded-lg px-3 py-2" value={editData.gender || 'Other'} onChange={(e) => setEditData((p) => ({ ...p, gender: e.target.value }))}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="profile-dob" className="text-sm text-gray-600 block mb-1">Birthday</label>
              <input id="profile-dob" type="date" className="w-full border rounded-lg px-3 py-2" value={editData.dob || ''} onChange={(e) => setEditData((p) => ({ ...p, dob: e.target.value }))} />
            </div>
          </div>

          <div>
            <label htmlFor="profile-address1" className="text-sm text-gray-600 block mb-1">Address line 1</label>
            <input id="profile-address1" className="w-full border rounded-lg px-3 py-2 mb-2" value={editData.address?.line1 || ''} onChange={(e) => setEditData((p) => ({ ...p, address: { ...(p.address || {}), line1: e.target.value } }))} />
            <label htmlFor="profile-address2" className="text-sm text-gray-600 block mb-1">Address line 2</label>
            <input id="profile-address2" className="w-full border rounded-lg px-3 py-2" value={editData.address?.line2 || ''} onChange={(e) => setEditData((p) => ({ ...p, address: { ...(p.address || {}), line2: e.target.value } }))} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(editData, image)}
            className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal
