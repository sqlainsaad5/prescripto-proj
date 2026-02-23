import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useDispatch } from "react-redux";
import { contactUs } from "../store/slices/userSlice";

const Contact = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(contactUs(formData));
    setLoading(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        {/* Contact Info Section */}
        <div className="flex flex-col justify-center items-start gap-6">
          <img
            className="w-full md:max-w-[360px]"
            src={assets.contact_image}
            alt="Contact"
          />
          <div className="flex flex-col justify-center items-start gap-6">
            <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
            <p className="text-gray-500">
              00000 Willms Station
              <br /> Suite 000, Washington, USA
            </p>
            <p className="text-gray-500">
              Tel: (000) 000-0000 <br />
              Email: saadamjad558@gmail.com
            </p>
            <p className="font-semibold text-lg text-gray-600">
              CAREERS AT PRESCRIPTO
            </p>
            <p className="text-gray-500">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
              Explore Jobs
            </button>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="w-full md:max-w-[600px] border p-8 bg-white rounded-sm">
          <p className="font-semibold text-lg text-gray-600 mb-6 uppercase tracking-wider">Send a Message</p>
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 font-medium font-medium">Full Name</label>
              <input
                required
                name="name"
                onChange={onChangeHandler}
                value={formData.name}
                className="border border-gray-300 rounded-sm px-4 py-2.5 outline-none focus:border-black transition-all text-gray-700"
                type="text"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 font-medium">Email Address</label>
              <input
                required
                name="email"
                onChange={onChangeHandler}
                value={formData.email}
                className="border border-gray-300 rounded-sm px-4 py-2.5 outline-none focus:border-black transition-all text-gray-700"
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 font-medium">Subject</label>
              <input
                required
                name="subject"
                onChange={onChangeHandler}
                value={formData.subject}
                className="border border-gray-300 rounded-sm px-4 py-2.5 outline-none focus:border-black transition-all text-gray-700"
                type="text"
                placeholder="What is this regarding?"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 font-medium">Message</label>
              <textarea
                required
                name="message"
                onChange={onChangeHandler}
                value={formData.message}
                className="border border-gray-300 rounded-sm px-4 py-2.5 outline-none focus:border-black transition-all text-gray-700 min-h-[150px] resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button
              disabled={loading}
              className="mt-2 bg-black text-white px-10 py-4 text-sm hover:bg-gray-800 active:bg-gray-900 transition-all font-semibold uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
              type="submit"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  SENDING...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
