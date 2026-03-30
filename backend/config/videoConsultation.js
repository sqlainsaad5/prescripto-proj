/**
 * Video consultation tuning. Override in .env:
 * VIDEO_JOIN_EARLY_MINUTES — minutes before slot time join is allowed (default 15)
 * VIDEO_JOIN_LATE_MINUTES — minutes after slot time join still allowed (default 180)
 * VIDEO_JOIN_TOKEN_EXPIRES_MINUTES — short-lived join token TTL (default 15)
 * JITSI_DOMAIN — Jitsi Meet host (default meet.jit.si)
 */
const positiveInt = (value, fallback) => {
    const n = Number.parseInt(String(value ?? ''), 10)
    return Number.isFinite(n) && n > 0 ? n : fallback
}

export const videoConsultationConfig = {
    joinEarlyMinutes: positiveInt(process.env.VIDEO_JOIN_EARLY_MINUTES, 15),
    joinLateMinutes: positiveInt(process.env.VIDEO_JOIN_LATE_MINUTES, 180),
    joinTokenExpiresMinutes: positiveInt(process.env.VIDEO_JOIN_TOKEN_EXPIRES_MINUTES, 15),
    jitsiDomain: (process.env.JITSI_DOMAIN || 'meet.jit.si').trim() || 'meet.jit.si',
    defaultProvider: 'jitsi'
}
