import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { uploadLabReport } from '../store/slices/userSlice'

const TYPES = [
  { value: 'xray', label: 'X-ray' },
  { value: 'blood_test', label: 'Blood test report' },
  { value: 'diagnostic', label: 'Diagnostic document' }
]

const LabReportUpload = ({ appointmentId, appointmentLabel, onSuccess, onCancel }) => {
  const dispatch = useDispatch()
  const [type, setType] = useState('blood_test')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setSubmitting(true)
    const result = await dispatch(uploadLabReport({ appointmentId, type, file }))
    setSubmitting(false)
    if (uploadLabReport.fulfilled.match(result)) {
      onSuccess()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md border border-gray-200">
      <p className="text-sm font-medium text-gray-500 mb-1">Upload lab report</p>
      {appointmentLabel && (
        <p className="text-base text-gray-700 mb-4">{appointmentLabel}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Report type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File (image or PDF)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#3B82F6] file:text-white hover:file:bg-[#2563EB]"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !file}
            className="px-5 py-2.5 rounded-lg bg-[#3B82F6] text-white text-sm font-medium disabled:opacity-50 hover:bg-[#2563EB] transition-colors"
          >
            {submitting ? 'Uploading...' : 'Upload'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default LabReportUpload
