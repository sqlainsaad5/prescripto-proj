import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppoinments'
import MyPrescriptions from './pages/MyPrescriptions'
import Appointment from './pages/Appointment'
import FollowUpBook from './pages/FollowUpBook'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-prescriptions' element={<MyPrescriptions />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/follow-up-book' element={<FollowUpBook />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
