import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctorsData } from '../store/slices/doctorSlice'

/**
 * Loads the public doctors list once into Redux. Safe to call from any mounted component;
 * duplicate calls are skipped after the first attempt.
 */
export function useDoctorsLoader() {
  const dispatch = useDispatch()
  const { doctors, loading } = useSelector((state) => state.doctor)
  const fetchStartedRef = useRef(false)

  useEffect(() => {
    if (doctors.length > 0) return
    if (loading || fetchStartedRef.current) return
    fetchStartedRef.current = true
    dispatch(getDoctorsData())
  }, [dispatch, doctors.length, loading])
}
