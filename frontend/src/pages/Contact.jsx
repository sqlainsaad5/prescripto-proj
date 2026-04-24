import React, { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../data/assets";
import { useDispatch } from "react-redux";
import { contactUs } from "../store/slices/userSlice";
import { validateContactForm } from "../utils/validation/contactSchema";

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === "name" ? value.replace(/\d/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const client = validateContactForm(formData);
    if (!client.isValid) {
      setFieldErrors(client.fieldErrors);
      const first = Object.values(client.fieldErrors)[0];
      if (first) {
        toast.error(first);
      }
      return;
    }

    setLoading(true);
    const result = await dispatch(contactUs(formData));
    setLoading(false);

    if (contactUs.fulfilled.match(result)) {
      setFormData(emptyForm);
      setFieldErrors({});
    } else if (contactUs.rejected.match(result)) {
      const payload = result.payload;
      if (payload?.fieldErrors && Object.keys(payload.fieldErrors).length > 0) {
        setFieldErrors(payload.fieldErrors);
      }
    }
  };

  const inputErrorClass = (name) =>
    fieldErrors[name]
      ? "border-red-500 focus:border-red-600"
      : "border-gray-300 focus:border-black";

  return (
    <>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <h1>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </h1>
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
            <h2 className="font-semibold text-lg text-gray-600">OUR OFFICE</h2>
            <p className="text-gray-500">
              00000 Willms Station
              <br /> Suite 000, Washington, USA
            </p>
            <p className="text-gray-500">
              Tel: (000) 000-0000 <br />
              Email: saadamjad558@gmail.com
            </p>
            <h2 className="font-semibold text-lg text-gray-600">
              CAREERS AT PRESCRIPTO
            </h2>
            <p className="text-gray-500">
              Learn more about our teams and job openings.
            </p>
            <button
              type="button"
              className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500"
            >
              Explore Jobs
            </button>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="w-full md:max-w-[600px] border p-8 bg-white rounded-sm">
          <h2 className="font-semibold text-lg text-gray-600 mb-6 uppercase tracking-wider">
            Send a Message
          </h2>
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1">
              <label htmlFor="contact-name" className="text-gray-500 font-medium">
                Full Name
              </label>
              <input
                id="contact-name"
                name="name"
                onChange={onChangeHandler}
                value={formData.name}
                className={`border rounded-sm px-4 py-2.5 outline-none transition-all text-gray-700 ${inputErrorClass(
                  "name"
                )}`}
                type="text"
                placeholder="Enter your name"
                autoComplete="name"
              />
              {fieldErrors.name && (
                <p className="text-red-600 text-xs mt-0.5" role="alert">
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="contact-email" className="text-gray-500 font-medium">
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                onChange={onChangeHandler}
                value={formData.email}
                className={`border rounded-sm px-4 py-2.5 outline-none transition-all text-gray-700 ${inputErrorClass(
                  "email"
                )}`}
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="text-red-600 text-xs mt-0.5" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="contact-subject" className="text-gray-500 font-medium">
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                onChange={onChangeHandler}
                value={formData.subject}
                className={`border rounded-sm px-4 py-2.5 outline-none transition-all text-gray-700 ${inputErrorClass(
                  "subject"
                )}`}
                type="text"
                placeholder="What is this regarding?"
              />
              {fieldErrors.subject && (
                <p className="text-red-600 text-xs mt-0.5" role="alert">
                  {fieldErrors.subject}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="contact-message" className="text-gray-500 font-medium">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                onChange={onChangeHandler}
                value={formData.message}
                className={`border rounded-sm px-4 py-2.5 outline-none transition-all text-gray-700 min-h-[150px] resize-none ${inputErrorClass(
                  "message"
                )}`}
                placeholder="How can we help you?"
              />
              {fieldErrors.message && (
                <p className="text-red-600 text-xs mt-0.5" role="alert">
                  {fieldErrors.message}
                </p>
              )}
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
    </>
  );
};

export default Contact;
