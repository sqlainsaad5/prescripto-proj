import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addDoctor } from "../../redux/slices/adminSlice";
import DoctorImageUpload from "../../components/doctor/DoctorImageUpload";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 year");
  const [fee, setfee] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General phsician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const dispatch = useDispatch();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image not selected");
      }
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fee", Number(fee));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 }),
      );

      const resultAction = await dispatch(addDoctor(formData));

      if (addDoctor.fulfilled.match(resultAction)) {
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setfee('')
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <h2 className="mb-3 text-lg font-medium">Add Doctor</h2>

      <div className="bg-white px-8 py-8 border rounded w-full max-h-[80vh] overflow-y-scroll border-gray-300">
        <DoctorImageUpload docImg={docImg} setDocImg={setDocImg} />

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-name">Doctor Name</label>
              <input
                id="doctor-name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-email">Doctor Email</label>
              <input
                id="doctor-email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-password">Doctor Password</label>
              <input
                id="doctor-password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-experience">Experience</label>
              <select
                id="doctor-experience"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                name=""
              >
                <option value="1 year">1 Year</option>
                <option value="2 year">2 Year</option>
                <option value="3 year">3 Year</option>
                <option value="4 year">4 Year</option>
                <option value="5 year">5 Year</option>
                <option value="6 year">6 Year</option>
                <option value="7 year">7 Year</option>
                <option value="8 year">8 Year</option>
                <option value="9 year">9 Year</option>
                <option value="10 year">10 Year</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-fee">fee</label>
              <input
                id="doctor-fee"
                onChange={(e) => setfee(e.target.value)}
                value={fee}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                type="number"
                placeholder="fee"
                required
              />
            </div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-speciality">Speciality</label>
              <select
                id="doctor-speciality"
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                name="name"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-education">Education</label>
              <input
                id="doctor-education"
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                type="text"
                placeholder="Education"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-address1">Address</label>
              <input
                id="doctor-address1"
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                type="text"
                placeholder="address 1"
                required
              />
              <input
                id="doctor-address2"
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border border-gray-300 rounded px-3 py-2 text-gray-700"
                type="text"
                placeholder="address 2"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="doctor-about" className="mt-4 mb-2 block">About Doctor</label>
          <textarea
            id="doctor-about"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border border-gray-300 rounded"
            type="text"
            placeholder="About Doctor"
            row={5}
            required
          />
        </div>
        <button
          type="Submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
