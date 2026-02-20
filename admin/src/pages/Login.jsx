import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../store/slices/adminSlice";
import { loginDoctor } from "../store/slices/doctorSlice";

const Login = () => {
  const [state, setstate] = useState("Admin");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch();

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (state === 'Admin') {
      dispatch(loginAdmin({ email, password }));
    } else {
      dispatch(loginDoctor({ email, password }));
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className="flex flex-col gap-3 m-auto items-start p-8 win-w-[340px] sm:min-w-96 border rounded-xl text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className="border border-[#DADADA] rounded w-full p-2 mt-1 " type="text" required />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className="border border-[#DADADA] rounded w-full p-2 mt-1 " type="text" required />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>
        {
          state === 'Admin'
            ? <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={() => setstate('Doctor')}>Click here</span></p>
            : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setstate('Admin')}>Click here</span></p>
        }
      </div>
    </form>
  );
};

export default Login;
