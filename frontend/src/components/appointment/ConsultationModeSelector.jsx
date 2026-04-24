import React from 'react'

const ConsultationModeSelector = ({ consultationMode, setConsultationMode }) => {
  return (
    <div className="flex items-center gap-3 mt-3">
      <button
        type="button"
        onClick={() => setConsultationMode('in_person')}
        className={`px-4 py-2 text-sm rounded-full border transition-colors ${
          consultationMode === 'in_person'
            ? 'bg-primary text-white border-primary'
            : 'border-gray-300 text-gray-600 hover:bg-primary/5'
        }`}
      >
        In Person
      </button>
      <button
        type="button"
        onClick={() => setConsultationMode('video')}
        className={`px-4 py-2 text-sm rounded-full border transition-colors ${
          consultationMode === 'video'
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'border-gray-300 text-gray-600 hover:bg-indigo-50'
        }`}
      >
        Video Consultation
      </button>
    </div>
  )
}

export default ConsultationModeSelector
