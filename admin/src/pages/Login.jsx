import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../redux/slices/adminSlice";
import { loginDoctor } from "../redux/slices/doctorSlice";

const Login = () => {
  const [state, setState] = useState("Admin");
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
        <h1 className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </h1>
        <div className="w-full">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" onChange={(e) => setEmail(e.target.value)} value={email} className="border border-[#DADADA] rounded w-full p-2 mt-1 " type="email" required />
        </div>
        <div className="w-full">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" onChange={(e) => setPassword(e.target.value)} value={password} className="border border-[#DADADA] rounded w-full p-2 mt-1 " type="password" required />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>
        {
          state === 'Admin'
            ? <div>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></div>
            : <div>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></div>
        }
      </div>
    </form>
  );
};

export default Login;
