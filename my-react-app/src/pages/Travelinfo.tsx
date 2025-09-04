/* eslint-disable @typescript-eslint/no-explicit-any */
// File: TravellerForm.tsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User2, Mail, MessageSquare, MapPin, Users, Info,
  CheckCircle, AlertCircle, Loader2, XCircle, Bus,
  Check, HandCoins, CalendarCheck
} from 'lucide-react';
import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { cardVariants, messageVariants, itemVariants } from '../hooks/useAnimationVariants';

import {
  useGetBookingInfoQuery,
  useSaveTravellerInfoMutation,
} from "../service/apiSlice";

export default function TravellerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean | null>(null);


  const queryParams = new URLSearchParams(location.search);
  const travellerType = (queryParams.get('travellerType') as 'local' | 'foreign') || 'local';
  const passengerType = queryParams.get('passengerType') || 'N/A';

   const MMK_TO_USD_RATE = 3500;

  const [form, setForm] = useState({
    name: '',
    genderType: passengerType,
    phone: '',
    email: '',
    special_request: ''
  });


  const {
  data: booking,
  error: bookingError,
  isLoading: loadingBooking,
} = useGetBookingInfoQuery(id!, { skip: !id });

// ✅ save traveller info mutation
const [saveTravellerInfo, { isLoading: isSubmitting }] =
  useSaveTravellerInfoMutation();

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage(null);
  setMessageType(null);

  if (!form.name || !form.genderType || !form.phone) {
    setMessageType("error");
    setMessage("Please fill in all required fields (Name, Gender, Phone).");
    return;
  }

  try {
    const res = await saveTravellerInfo({ ...form, booking_id: id }).unwrap();
    if (res.success) {
      setMessageType("success");
      setMessage("Traveller info saved! Redirecting to payment...");
      setTimeout(() => {
        navigate(`/payment/${id}?travellerType=${travellerType}`);
      }, 3000);
    } else {
      setMessageType("error");
      setMessage(res.error || "Something went wrong while saving traveller info.");
    }
  } catch (err: any) {
    setMessageType("error");
    setMessage(err?.data?.error || "An unexpected error occurred.");
  }
};



  const formatPrice = (priceInMMK: number) => {
    if (travellerType === 'foreign') {
      const priceInUSD = priceInMMK / MMK_TO_USD_RATE;
      return `${priceInUSD.toFixed(2)} USD`;
    }
    return `${priceInMMK.toLocaleString()} MMK`;
  };

  const handlePhoneChange = (value: string | undefined) => {
    setForm({ ...form, phone: value || '' });
    if (value) {
      setIsPhoneValid(isValidPhoneNumber(value));
    } else {
      setIsPhoneValid(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-800">
      <UserNavbar />
      <div className="flex-grow flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Traveller Information Form */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6 sm:mb-8">
              Traveller Information <span className="text-red-500">*</span>
            </h2>

            <AnimatePresence>
              {message && (
                <motion.div
                  className={`p-4 rounded-xl text-sm mb-6 flex items-center gap-3 ${
                    messageType === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                  } border`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {messageType === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  <span className="font-medium">{message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Name */}
              <motion.div className="relative" variants={itemVariants}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="peer w-full p-4 pt-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-gray-800 placeholder-transparent bg-gray-50"
                  placeholder="Enter your full name"
                  required
                />
                <label
                  htmlFor="name"
                  className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                >
                   Name
                </label>
                <User2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-600 transition-colors" />
              </motion.div>

              {/* Gender */}
              <motion.div className="relative" variants={itemVariants}>
                <div className="w-full">

                  <label htmlFor="passengerType" className="sr-only">Passenger Type</label>
                  <select
                    id="passengerType"
                    name="passengerType"
                    value={form.genderType}
                    onChange={handleChange}
                    className="w-full p-4 pt-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-gray-800 bg-gray-50 appearance-none"
                    required
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Monk">Monk</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </div>
                </div>
                <label
                  htmlFor="genderType"
                  className="absolute left-4 top-2 text-xs text-gray-500 transition-all -translate-y-0 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Gender
                </label>
              </motion.div>


              {/* Phone */}
              <motion.div className="relative" variants={itemVariants}>
                <PhoneInput
                  international
                  defaultCountry="MM"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  className="peer w-full p-4 pt-6 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all text-gray-800 bg-gray-50 border border-gray-300"
                  placeholder="Your Phone Number"
                  max={11}
                  required
                />
                <label
                  htmlFor="phone"
                  className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Phone Number
                </label>
                {isPhoneValid === true && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {isPhoneValid === false && (
                  <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </motion.div>

              {/* Email */}
              <motion.div className="relative" variants={itemVariants}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="peer w-full p-4 pt-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-gray-800 placeholder-transparent bg-gray-50"
                  placeholder="example@email.com"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Email <span className="text-gray-400">(optional)</span>
                </label>
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-600 transition-colors" />
              </motion.div>

              {/* Special Request */}
              <motion.div className="relative" variants={itemVariants}>
                <textarea
                  id="special_request"
                  name="special_request"
                  value={form.special_request}
                  onChange={handleChange}
                  rows={3}
                  className="peer w-full p-4 pt-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-gray-800 placeholder-transparent resize-y bg-gray-50"
                  placeholder="Any special requests or notes?"
                ></textarea>
                <label
                  htmlFor="special_request"
                  className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Special Request <span className="text-gray-400">(optional)</span>
                </label>
                <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-600 transition-colors" />
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                variants={itemVariants}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Continue to Payment <HandCoins className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Trip Summary Card */}
          <motion.div
            className="lg:col-span-1 bg-white rounded-3xl shadow-xl p-6 md:p-8 h-fit border border-gray-100 sticky top-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h5 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">Trip Summary</h5>
            {loadingBooking ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <p className="text-gray-600">Loading trip details...</p>
              </div>
            ) : bookingError ? (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
    <p className="font-semibold">Error:</p>
    <p>{(bookingError as any)?.message || "Failed to load booking details"}</p>
  </div>
            ) : booking ? (
              <>
                <div className="space-y-4 text-gray-700 my-4">
                  {/* Departure/Arrival Times */}
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="flex items-center gap-3 font-semibold text-blue-700">
                        <MapPin className="text-blue-500 w-5 h-5" /> From
                      </span>
                      <span className="text-sm font-medium">{booking.start_location}</span>
                    </div>
                    <div className="flex items-center gap-3 font-medium text-gray-600 mt-1">
                      <CalendarCheck className="text-blue-500 w-4 h-4" />
                      {new Date(booking.departure_time).toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="flex items-center gap-3 font-semibold text-green-700">
                        <MapPin className="text-green-500 w-5 h-5" /> To
                      </span>
                      <span className="text-sm font-medium">{booking.end_location}</span>
                    </div>
                    <div className="flex items-center gap-3 font-medium text-gray-600 mt-1">
                      <CalendarCheck className="text-green-500 w-4 h-4" />
                      {new Date(booking.arrival_time).toLocaleString()}
                    </div>
                  </div>

                  <small className="text-gray-500 block mt-2 text-xs text-center">
                    <Info className="inline-block w-3 h-3 mr-1" /> Arrival times are estimates.
                  </small>
                </div>

                <div className="space-y-3 text-gray-700 mb-6 border-b pb-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-600 font-medium"><Bus className="w-5 h-5 text-purple-500" /> Bus Operator:</span>
                    <span className="text-gray-900 font-semibold">{booking.opertor_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-600 font-medium"><Check className="w-5 h-5 text-cyan-500" /> Bus Type:</span>
                    <span className="text-gray-900 font-semibold">{booking.bus_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-600 font-medium"><Users className="w-5 h-5 text-orange-500" /> Seats:</span>
                    <span className="text-gray-900 font-semibold">{booking.seats.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-600 font-medium">Passenger Type:</span>
                    <span className="text-gray-900 font-semibold">{passengerType}</span>
                  </div>
                </div>

                <div className="font-bold text-3xl text-green-600 mt-6 text-center">
                  Total: {formatPrice(booking.total_amount)}
                </div>

                <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg mt-6 text-sm text-gray-700">
                  <strong className="block text-blue-800 mb-2">Notices by {booking.opertor_name}</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>NRC required</li>
                    {/* Add more notices from your data here */}
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md text-sm">
                <p className="font-semibold">No Booking Found</p>
                <p>Please go back to the search page to select a trip.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}