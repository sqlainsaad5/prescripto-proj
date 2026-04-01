import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadUserProfileData } from '../store/slices/userSlice'

/**
 * When a session token exists but profile is not in Redux, loads the current user.
 * Intended for layout/shell components (e.g. Navbar) so the header has userData on every route.
 */
export function useSessionUserProfile() {
  const dispatch = useDispatch()
  const { token, userData } = useSelector((state) => state.user)
  const inFlightRef = useRef(false)

  useEffect(() => {
    if (!token) {
      inFlightRef.current = false
      return
    }
    if (userData) return
    if (inFlightRef.current) return
    inFlightRef.current = true
    const p = dispatch(loadUserProfileData())
    if (p && typeof p.finally === 'function') {
      p.finally(() => {
        inFlightRef.current = false
      })
    } else {
      inFlightRef.current = false
    }
  }, [dispatch, token, userData])
}
