import React from 'react'

const TimeSlotPicker = ({ docSlots, slotIndex, slotTime, setSlotTime }) => {
  return (
    <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
      {docSlots.length > 0 && docSlots[slotIndex] &&
        docSlots[slotIndex].map((item, index) => (
          <button
            type="button"
            onClick={() => {
              if (!item.booked) setSlotTime(item.time)
            }}
            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full ${
              item.booked
                ? 'bg-red-100 text-red-500 border border-red-300 cursor-not-allowed'
                : item.time === slotTime
                  ? 'bg-primary text-white cursor-pointer'
                  : 'text-gray-400 border border-gray-300 cursor-pointer hover:bg-primary/5'
            } `}
            key={index}
          >
            {item.time.toLowerCase()}
          </button>
        ))}
    </div>
  )
}

export default TimeSlotPicker
