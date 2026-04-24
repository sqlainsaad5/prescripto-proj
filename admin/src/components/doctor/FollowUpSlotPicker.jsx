import React from 'react'

const FollowUpSlotPicker = ({
  docSlots,
  slotIndex,
  setSlotIndex,
  setSlotTime,
  slotTime,
  daysofWeek,
}) => {
  return (
    <>
      <div className="flex gap-3 items-center w-full overflow-x-auto">
        {docSlots.map((daySlots, index) => (
          <div
            key={index}
            onClick={() => { setSlotIndex(index); setSlotTime(''); }}
            className={`text-center py-4 min-w-14 rounded-full cursor-pointer flex-shrink-0 ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
          >
            <span className="text-xs block">{daySlots[0] && daysofWeek[daySlots[0].datetime.getDay()]}</span>
            <span>{daySlots[0] && daySlots[0].datetime.getDate()}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {docSlots[slotIndex]?.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={item.booked}
            onClick={() => !item.booked && setSlotTime(item.time)}
            className={`text-sm px-4 py-2 rounded-full ${
              item.booked
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : item.time === slotTime
                  ? 'bg-primary text-white'
                  : 'border border-gray-300 hover:bg-primary/10'
            }`}
          >
            {item.time.toLowerCase()}
          </button>
        ))}
      </div>
    </>
  )
}

export default FollowUpSlotPicker
