import React, { useEffect, useState } from "react";
import { assets } from "../data/assets";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from 'react-toastify';
import { bookAppointment as bookAppointmentThunk } from "../store/slices/userSlice";
import useDoctorSlots from "../components/appointment/useDoctorSlots";
import ConsultationModeSelector from "../components/appointment/ConsultationModeSelector";
import DaySlotCarousel from "../components/appointment/DaySlotCarousel";
import TimeSlotPicker from "../components/appointment/TimeSlotPicker";

const Appointment = () => {
  const { docId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { doctors } = useSelector((state) => state.doctor);
  const { token } = useSelector((state) => state.user);
  const { currencySymbol } = useSelector((state) => state.app);

  const daysofWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const { docSlots, slotIndex, setSlotIndex, slotTime, setSlotTime } = useDoctorSlots(docInfo);
  const [consultationMode, setConsultationMode] = useState("in_person");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const handleBookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    if (!slotTime) {
      toast.warn('Please select a time slot before booking')
      return
    }

    try {
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      const resultAction = await dispatch(
        bookAppointmentThunk({ docId, slotDate, slotTime, consultationMode })
      )

      if (bookAppointmentThunk.fulfilled.match(resultAction)) {
        // doctor data already refreshed in thunk; just navigate
        navigate('/my-appointments')
      }
    } catch (error) {
      // errors are already handled and toasted inside the thunk
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  // Whenever the global doctor data changes (e.g., another user books a slot),
  // refresh this doctor's info and recompute its available slots.
  useEffect(() => {
    fetchDocInfo();
  }, [doctors]);

  return (
    docInfo && (
      <>
        {/* ------------Doctor Details------------*/}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80] sm:mt-0">
            {/* -----------doc info: name,degree,experience------------*/}
            <h1 className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </h1>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <span>
                {docInfo.degree} - {docInfo.speciality}
              </span>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* ------------Doctor About------------*/}
            <div>
              <h2 className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </h2>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <div className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span>
                {currencySymbol}
                {docInfo.fees}
              </span>
            </div>
          </div>
        </div>
        {/* ------------Booking Slots------------*/}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <h3>Consultation type</h3>
          <ConsultationModeSelector consultationMode={consultationMode} setConsultationMode={setConsultationMode} />
          <h3>Booking slots</h3>
          <DaySlotCarousel docSlots={docSlots} slotIndex={slotIndex} setSlotIndex={setSlotIndex} daysofWeek={daysofWeek} />
          <TimeSlotPicker docSlots={docSlots} slotIndex={slotIndex} slotTime={slotTime} setSlotTime={setSlotTime} />
          <button onClick={handleBookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">
            Book an appointment
          </button>
        </div>
        {/* ------------Related Doctors------------*/}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </>
    )
  );
};

export default Appointment;
