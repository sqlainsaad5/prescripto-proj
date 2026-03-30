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

const MyAppoinments = () => {
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
        <p className="font-medium text-zinc-700">My appointments</p>
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
            {appointments.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b border-gray-200"
                key={index}
              >
                <div>
                  <img
                    className="w-32 h-32 object-cover rounded-lg bg-indigo-50"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                </div>
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold text-base">
                    {item.docData.name}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {item.docData.speciality}
                  </p>
                  <p className="mt-1.5">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${
                        item.consultationMode === 'video'
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                      }`}
                    >
                      {item.consultationMode === 'video'
                        ? 'Video consultation'
                        : 'In person'}
                    </span>
                  </p>
                  {item.consultationMode === 'video' && !item.cancelled && !item.isCompleted && (
                    <p className="text-xs text-zinc-500 mt-1 max-w-md">
                      Join the video call after your doctor starts the session (near your appointment time).
                    </p>
                  )}
                  <p className="text-zinc-700 font-medium mt-2 text-sm">
                    Address
                  </p>
                  <p className="text-xs">{item.docData.address.line1}</p>
                  <p className="text-xs">{item.docData.address.line2}</p>
                  <p className="text-xs mt-2">
                    <span className="text-sm text-neutral-700 font-medium">
                      Date &amp; Time:
                    </span>{' '}
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  {!item.cancelled &&
                    !item.payment &&
                    !item.isCompleted && (
                      <button
                        onClick={() => dispatch(startAppointmentStripe(item._id))}
                        className="text-sm text-stone-600 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-primary hover:text-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                      >
                        Pay Online
                      </button>
                    )}
                  {!item.cancelled &&
                    item.payment &&
                    !item.isCompleted && (
                      <button className="text-sm text-indigo-600 text-center sm:min-w-48 py-2 border rounded-lg bg-indigo-50">
                        Paid
                      </button>
                    )}
                  {!item.cancelled &&
                    item.consultationMode === 'video' &&
                    !item.isCompleted && (
                      <button
                        onClick={() => dispatch(joinVideoConsultation(item._id))}
                        className="text-sm text-indigo-600 text-center sm:min-w-48 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-50 hover:shadow-sm transition-all duration-200"
                      >
                        Join Video Call
                      </button>
                    )}
                  {!item.cancelled &&
                    !item.isCompleted && (
                      <button
                        onClick={() => dispatch(cancelAppointmentThunk(item._id))}
                        className="text-sm text-red-600 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-red-600 hover:text-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                      >
                        Cancel appointment
                      </button>
                    )}
                  {!item.cancelled && (
                    <button
                      onClick={() => setUploadAppointment(item)}
                      className="text-sm text-[#3B82F6] text-center sm:min-w-48 py-2 border border-[#3B82F6] rounded-lg hover:bg-[#3B82F6] hover:text-white hover:shadow-sm transition-all duration-200"
                    >
                      Upload lab report
                    </button>
                  )}
                  {item.cancelled && !item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded-lg text-red-500 text-sm">
                      Appointment cancelled
                    </button>
                  )}
                  {item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-green-500 rounded-lg text-green-500 text-sm">
                      Completed
                    </button>
                  )}
                </div>
              </div>
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

export default MyAppoinments
