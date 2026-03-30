import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from 'react-toastify';
import { getDoctorsData } from "../store/slices/doctorSlice";
import { bookAppointment as bookAppointmentThunk } from "../store/slices/userSlice";

const Appointment = () => {
  const { docId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { doctors } = useSelector((state) => state.doctor);
  const { token } = useSelector((state) => state.user);
  const { currencySymbol } = useSelector((state) => state.app);

  const daysofWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotsIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [consultationMode, setConsultationMode] = useState("in_person");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setDocSlots([]);
    //geting current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      //setting end time of date with indexes
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTimeVar = formattedTime

        const isSlotBooked =
          docInfo.slots_booked &&
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTimeVar)

        // add slot to array, marking whether it is already booked
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
          booked: !!isSlotBooked,
        });

        //incrememt time by 30minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
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

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

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
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* ------------Doctor About------------*/}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span>
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
        {/* ------------Booking Slots------------*/}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Consultation type</p>
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => setConsultationMode("in_person")}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                consultationMode === "in_person"
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 text-gray-600 hover:bg-primary/5"
              }`}
            >
              In Person
            </button>
            <button
              type="button"
              onClick={() => setConsultationMode("video")}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                consultationMode === "video"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 text-gray-600 hover:bg-indigo-50"
              }`}
            >
              Video Consultation
            </button>
          </div>
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotsIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index
                    ? "bg-primary text-white"
                    : "border border-gray-200"
                    }`}
                  key={index}
                >
                  <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 && docSlots[slotIndex] &&
              docSlots[slotIndex].map((item, index) => (
                <p
                onClick={() => {
                  if (!item.booked) {
                    setSlotTime(item.time)
                  }
                }}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full ${
                  item.booked
                    ? "bg-red-100 text-red-500 border border-red-300 cursor-not-allowed"
                    : item.time === slotTime
                    ? "bg-primary text-white cursor-pointer"
                    : "text-gray-400 border border-gray-300 cursor-pointer hover:bg-primary/5"
                } `}
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
              ))}
          </div>
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
