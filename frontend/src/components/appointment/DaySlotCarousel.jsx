import React from 'react'

const DaySlotCarousel = ({ docSlots, slotIndex, setSlotIndex, daysofWeek }) => {
  return (
    <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
      {docSlots.length > 0 &&
        docSlots.map((item, index) => (
          <div
            onClick={() => setSlotIndex(index)}
            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
              slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
            }`}
            key={index}
          >
            <span>{item[0] && daysofWeek[item[0].datetime.getDay()]}</span>
            <span>{item[0] && item[0].datetime.getDate()}</span>
          </div>
        ))}
    </div>
  )
}

export default DaySlotCarousel
