import React from 'react'
import { slotDateFormat } from '../../utils/helpers'

const AppointmentCard = ({
  item,
  onPayOnline,
  onJoinVideo,
  onCancelAppointment,
  onUploadReport,
}) => {
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b border-gray-200">
      <div>
        <img className="w-32 h-32 object-cover rounded-lg bg-indigo-50" src={item.docData.image} alt={item.docData.name} />
      </div>
      <div className="flex-1 text-sm text-zinc-600">
        <h2 className="text-neutral-800 font-semibold text-base">{item.docData.name}</h2>
        <p className="text-sm text-zinc-500">{item.docData.speciality}</p>
        <p className="mt-1.5">
          <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${
            item.consultationMode === 'video'
              ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
              : 'border-zinc-200 bg-zinc-50 text-zinc-600'
          }`}>
            {item.consultationMode === 'video' ? 'Video consultation' : 'In person'}
          </span>
        </p>
        {item.consultationMode === 'video' && !item.cancelled && !item.isCompleted && (
          <p className="text-xs text-zinc-500 mt-1 max-w-md">
            Join the video call after your doctor starts the session (near your appointment time).
          </p>
        )}
        <h3 className="text-zinc-700 font-medium mt-2 text-sm">Address</h3>
        <p className="text-xs">{item.docData.address.line1}</p>
        <p className="text-xs">{item.docData.address.line2}</p>
        <p className="text-xs mt-2">
          <span className="text-sm text-neutral-700 font-medium">Date &amp; Time:</span>{' '}
          {slotDateFormat(item.slotDate)} | {item.slotTime}
        </p>
      </div>
      <div className="flex flex-col gap-2 justify-end">
        {!item.cancelled && !item.payment && !item.isCompleted && (
          <button onClick={onPayOnline} className="text-sm text-stone-600 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-primary hover:text-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">Pay Online</button>
        )}
        {!item.cancelled && item.payment && !item.isCompleted && (
          <button className="text-sm text-indigo-600 text-center sm:min-w-48 py-2 border rounded-lg bg-indigo-50">Paid</button>
        )}
        {!item.cancelled && item.consultationMode === 'video' && !item.isCompleted && (
          <button onClick={onJoinVideo} className="text-sm text-indigo-600 text-center sm:min-w-48 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-50 hover:shadow-sm transition-all duration-200">Join Video Call</button>
        )}
        {!item.cancelled && !item.isCompleted && (
          <button onClick={onCancelAppointment} className="text-sm text-red-600 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-red-600 hover:text-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">Cancel appointment</button>
        )}
        {!item.cancelled && (
          <button onClick={onUploadReport} className="text-sm text-[#3B82F6] text-center sm:min-w-48 py-2 border border-[#3B82F6] rounded-lg hover:bg-[#3B82F6] hover:text-white hover:shadow-sm transition-all duration-200">Upload lab report</button>
        )}
        {item.cancelled && !item.isCompleted && (
          <button className="sm:min-w-48 py-2 border border-red-500 rounded-lg text-red-500 text-sm">Appointment cancelled</button>
        )}
        {item.isCompleted && (
          <button className="sm:min-w-48 py-2 border border-green-500 rounded-lg text-green-500 text-sm">Completed</button>
        )}
      </div>
    </div>
  )
}

export default AppointmentCard
