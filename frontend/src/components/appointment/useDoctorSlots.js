import { useEffect, useState } from 'react'

const useDoctorSlots = (docInfo) => {
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  useEffect(() => {
    if (!docInfo) return
    setDocSlots([])
    setSlotIndex(0)
    setSlotTime('')

    let today = new Date()
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()
        const slotDate = day + '_' + month + '_' + year
        const isSlotBooked =
          docInfo.slots_booked &&
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(formattedTime)

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
          booked: !!isSlotBooked,
        })
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDocSlots((prev) => [...prev, timeSlots])
    }
  }, [docInfo])

  return { docSlots, slotIndex, setSlotIndex, slotTime, setSlotTime }
}

export default useDoctorSlots
