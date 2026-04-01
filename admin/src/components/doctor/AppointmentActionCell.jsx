import React from 'react'

const AppointmentActionCell = ({
  item,
  btnHistory,
  btnPrescription,
  btnFollowUp,
  onViewHistory,
  onOpenPrescription,
  onOpenFollowUp,
  onCancel,
  onComplete,
  onJoinVideo,
  onStartVideo,
  onEndVideo,
}) => {
  if (item.cancelled) {
    return (
      <div className='flex w-full min-w-0 flex-col gap-2'>
        <span className='text-red-400 text-xs font-medium'>Cancelled</span>
        <button type="button" onClick={onViewHistory} className={btnHistory}>View History</button>
      </div>
    )
  }

  if (item.isCompleted) {
    return (
      <div className='flex w-full min-w-0 flex-col gap-2'>
        <span className='text-green-500 text-xs font-medium'>Completed</span>
        <button type="button" onClick={onOpenPrescription} className={btnPrescription}>Generate Prescription</button>
        <button type="button" onClick={onOpenFollowUp} className={btnFollowUp}>Follow-up</button>
        <button type="button" onClick={onViewHistory} className={btnHistory}>View History</button>
      </div>
    )
  }

  return (
    <div className='flex w-full min-w-0 flex-col gap-2'>
      <div className='flex'>
        <img onClick={onCancel} className='w-10 cursor-pointer' src={item.cancelIcon} alt="" />
        <img onClick={onComplete} className='w-10 cursor-pointer' src={item.tickIcon} alt="" />
      </div>
      {item.consultationMode === 'video' && (
        <>
          {item.videoStatus === 'live' ? (
            <button type="button" onClick={onJoinVideo} className='w-full min-w-0 text-xs text-indigo-600 border border-indigo-500 px-2 py-1.5 rounded-md text-center hover:bg-indigo-50 transition-colors'>Join Call</button>
          ) : (
            <button type="button" onClick={onStartVideo} className='w-full min-w-0 text-xs text-indigo-600 border border-indigo-500 px-2 py-1.5 rounded-md text-center hover:bg-indigo-50 transition-colors'>Start Call</button>
          )}
          {item.videoStatus === 'live' && (
            <button type="button" onClick={onEndVideo} className='w-full min-w-0 text-xs text-red-500 border border-red-500 px-2 py-1.5 rounded-md text-center hover:bg-red-50 transition-colors'>End Call</button>
          )}
        </>
      )}
      <button type="button" onClick={onOpenFollowUp} className={btnFollowUp}>Follow-up</button>
      <button type="button" onClick={onViewHistory} className={btnHistory}>View History</button>
    </div>
  )
}

export default AppointmentActionCell
