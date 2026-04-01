import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../store/slices/userSlice";

const Login = () => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [state, setState] = useState("sign up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (state === "sign up") {
      dispatch(registerUser({ name, email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <h1 className="text-2xl font-semibold">
          {state === "sign up" ? "Create Account" : "Log in"}
        </h1>
        <p>
          Please {state === "sign up" ? "sign up" : "Log in"} up to book
          appointment
        </p>
        {state === "sign up" && (
          <div className="w-full">
            <label htmlFor="full-name">Full Name</label>
            <input
              id="full-name"
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        )}

        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base">
          {state === "sign up" ? "create Account" : "Log in"}
        </button>
        {state === "sign up" ? (
          <div>
            Already have an account?{" "}
            <span
              onClick={() => setState("Log in")}
              className="text-primary underline cursor-pointer"
            >
              {" "}
              Login here
            </span>
          </div>
        ) : (
          <div>
            Create an new account?
            <span
              onClick={() => setState("sign up")}
              className="text-primary underline cursor-pointer"
            >
              {" "}
              Click here
            </span>
          </div>
        )}
      </div>
    </form>
  );
};

export default Login;
