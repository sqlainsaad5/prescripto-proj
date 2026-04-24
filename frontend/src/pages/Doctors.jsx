import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useSelector((state) => state.doctor);


  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality])


  return (
    <>
      <div className='text-gray-600' >Browse through the doctors specialist.</div>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5 '>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <button type="button" onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate(`/doctors/General physician`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</button>
          <button type="button" onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate(`/doctors/Gynecologist`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</button>
          <button type="button" onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate(`/doctors/Dermatologist`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</button>
          <button type="button" onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate(`/doctors/Pediatricians`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</button>
          <button type="button" onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate(`/doctors/Neurologist`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</button>
          <button type="button" onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate(`/doctors/Gastroenterologist`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</button>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                <img className='bg-blue-50' src={item.image} alt="" />
                <div className='p-4'>
                  <div className='flex items-center gap-2 text-sm text-center text-green-500 '>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span><span>Available</span>
                  </div>
                  <h2 className='text-gray-900 text-lg font-medium'>{item.name}</h2>
                  <span className='text-gray-600 text-sm'>{item.speciality}</span>

                </div>

              </div>

            ))
          }
        </div>
      </div>
    </>
  )
}

export default Doctors
