import jwt from 'jsonwebtoken'
import { videoConsultationConfig } from '../config/videoConsultation.js'

export const parseAppointmentDateTime = (slotDate, slotTime) => {
    try {
        const [day, month, year] = (slotDate || '').split('_').map(Number)
        if (!day || !month || !year || !slotTime) return null

        const [timePart, period] = slotTime.trim().split(' ')
        const [rawHour, minute] = timePart.split(':').map(Number)
        if (Number.isNaN(rawHour) || Number.isNaN(minute)) return null

        let hour = rawHour
        const normalizedPeriod = (period || '').toUpperCase()
        if (normalizedPeriod === 'PM' && hour !== 12) hour += 12
        if (normalizedPeriod === 'AM' && hour === 12) hour = 0

        return new Date(year, month - 1, day, hour, minute).getTime()
    } catch (_) {
        return null
    }
}

export const isWithinJoinWindow = (appointment) => {
    const { joinEarlyMinutes, joinLateMinutes } = videoConsultationConfig
    const appointmentTime = parseAppointmentDateTime(appointment.slotDate, appointment.slotTime)
    if (!appointmentTime) return true
    const now = Date.now()
    const windowStart = appointmentTime - joinEarlyMinutes * 60 * 1000
    const windowEnd = appointmentTime + joinLateMinutes * 60 * 1000
    return now >= windowStart && now <= windowEnd
}

export const buildVideoJoinPayload = (appointment, role) => {
    const { joinTokenExpiresMinutes, jitsiDomain, defaultProvider } = videoConsultationConfig
    const secret = process.env.JWT_SECRET || 'prescripto-video-fallback-secret'
    const expiresIn = `${joinTokenExpiresMinutes}m`
    const joinToken = jwt.sign(
        { appointmentId: appointment._id.toString(), role },
        secret,
        { expiresIn }
    )
    const expiresAt = Date.now() + joinTokenExpiresMinutes * 60 * 1000
    const joinUrl = `https://${jitsiDomain}/${appointment.videoRoomId}`
    return {
        provider: appointment.videoProvider || defaultProvider,
        roomId: appointment.videoRoomId,
        joinUrl,
        joinToken,
        expiresAt
    }
}
