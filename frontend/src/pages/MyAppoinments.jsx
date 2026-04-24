import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { slotDateFormat } from '../utils/helpers'
import {
  fetchUserAppointments,
  cancelAppointmentThunk,
  startAppointmentStripe,
  verifyStripePayment,
  joinVideoConsultation,
} from '../store/slices/userSlice'
import LabReportUpload from '../components/LabReportUpload'
import AppointmentCard from '../components/appointments/AppointmentCard'

const MyAppointments = () => {
  const { token, appointments } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [uploadAppointment, setUploadAppointment] = useState(null)

  useEffect(() => {
    if (token) {
      dispatch(fetchUserAppointments())
    }
  }, [token, dispatch])

  useEffect(() => {
    if (token) {
      const query = new URLSearchParams(window.location.search)
      if (query.get('success') && query.get('appointmentId')) {
        const appointmentId = query.get('appointmentId')
        const success = query.get('success')
        const session_id = query.get('session_id')

        dispatch(
          verifyStripePayment({ appointmentId, success, session_id, navigate })
        )
      }
    }
  }, [token, navigate, dispatch])

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 pb-3 mt-12 border-b border-gray-200">
        <h1 className="font-medium text-zinc-700">My appointments</h1>
        <Link
          to="/my-prescriptions"
          className="text-sm text-primary hover:underline"
        >
          View your prescriptions
        </Link>
      </div>

      <div className="mt-8">
        {appointments.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-5">
            {/* Icon */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 shadow-sm">
              <span className="text-3xl text-gray-400">📅</span>
            </div>

            {/* Heading + subtext */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                No appointments booked yet
              </h2>
              <p className="max-w-md mx-auto text-base text-gray-600">
                You haven&apos;t booked any appointments. Browse doctors and
                book your first appointment.
              </p>
            </div>

            {/* CTA */}
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center px-7 py-3 bg-[#3B82F6] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[#2563EB] hover:shadow-md hover:scale-[1.02] transition-transform transition-colors duration-150 cursor-pointer"
            >
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div>
            {appointments.map((item) => (
              <AppointmentCard
                key={item._id}
                item={item}
                onPayOnline={() => dispatch(startAppointmentStripe(item._id))}
                onJoinVideo={() => dispatch(joinVideoConsultation(item._id))}
                onCancelAppointment={() => dispatch(cancelAppointmentThunk(item._id))}
                onUploadReport={() => setUploadAppointment(item)}
              />
            ))}
          </div>
        )}
      </div>

      {uploadAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <LabReportUpload
            appointmentId={uploadAppointment._id}
            appointmentLabel={`${slotDateFormat(uploadAppointment.slotDate)} | ${uploadAppointment.slotTime} – ${uploadAppointment.docData?.name}`}
            onSuccess={() => setUploadAppointment(null)}
            onCancel={() => setUploadAppointment(null)}
          />
        </div>
      )}
    </>
  )
}

export default MyAppointments
