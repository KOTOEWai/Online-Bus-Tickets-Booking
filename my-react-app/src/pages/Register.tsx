/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User2, Mail,  Lock, Eye, EyeOff,
  UserPlus, AlertCircle, CheckCircle, XCircle,
} from 'lucide-react'; 
import { containerVariants, itemVariants, messageVariants } from '../hooks/useAnimationVariants';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Don't forget to import the styles!
import { isValidPhoneNumber } from 'react-phone-number-input';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A state to track the validity of the phone number
  const [isPhoneValid, setIsPhoneValid] = useState<boolean | null>(null);

  const handlePhoneChange = (value: string | undefined) => {
    // Update the form state with the new phone number value
    setForm({ ...form, phone: value || '' });
    
    // Validate the phone number and update the validation state
    if (value) {
      setIsPhoneValid(isValidPhoneNumber(value));
    } else {
      setIsPhoneValid(null); // Reset when the input is empty
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);
    
    // --- VALIDATION CHECK ---
    // If phone number is not valid, stop the submission and show an error
    if (!form.phone || !isValidPhoneNumber(form.phone)) {
      setMessageType('error');
      setMessage('Please enter a valid phone number.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.message.includes('success')) {
        setMessageType('success');
        setMessage(data.message || 'Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/Login');
        }, 9500);
      } else {
        setMessageType('error');
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setMessageType('error');
      setMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-Up is not fully implemented in this demo. Please use email/password.');
    console.log('Attempting Google Sign-Up...');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Section (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 mb-8"
            variants={itemVariants}
          >
            Sign Up
          </motion.h2>

          <AnimatePresence>
            {message && (
              <motion.div
                className={`p-3 rounded-lg text-sm mb-6 flex items-center gap-2 ${
                  messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {messageType === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... Other form fields (Name, Email) ... */}
            <motion.div className="relative" variants={itemVariants}>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-transparent"
                placeholder="Your Full Name"
                required
              />
              <label
                htmlFor="name"
                className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
              >
                Full Name
              </label>
              <User2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-500" />
            </motion.div>

            <motion.div className="relative" variants={itemVariants}>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-transparent"
                placeholder="Your Email"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
              >
                Email
              </label>
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-500" />
            </motion.div>

            {/* Phone */}
            <motion.div className="relative" variants={itemVariants}>
              <PhoneInput
                international
                defaultCountry="MM"
                value={form.phone}
                onChange={handlePhoneChange} // Use the new handler here
                className="peer w-full p-3 pt-5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-transparent"
                placeholder="Your Phone Number"
                required
              />
              <label
                htmlFor="phone"
                className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
              >
                Phone Number
              </label>
              {isPhoneValid === true && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {isPhoneValid === false && (
                <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </motion.div>

            {/* ... Other form fields (Password, Terms, Buttons) ... */}
            <motion.div className="relative" variants={itemVariants}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-transparent"
                placeholder="Your Password"
                required
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <Lock className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-500" />
            </motion.div>

            <motion.div className="flex items-center justify-center text-sm" variants={itemVariants}>
              <label htmlFor="terms" className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <span className="ml-2 text-gray-700">
                  I agree to all statements in{' '}
                  <Link to="#" className="text-blue-600 hover:underline">
                    Terms of service
                  </Link>
                </span>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !isPhoneValid}
              variants={itemVariants}
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> Register
                </>
              )}
            </motion.button>
            
            <motion.div className="relative flex items-center justify-center py-4" variants={itemVariants}>
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </motion.div>

            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg text-lg font-semibold shadow-sm hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2"
              variants={itemVariants}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-6 h-6" />
              Sign up with Google
            </motion.button>

            <motion.p className="text-center text-gray-600 mt-6" variants={itemVariants}>
              Already have an account?{' '}
              <Link to="/Login" className="text-blue-600 hover:underline font-semibold">
                Sign In
              </Link>
            </motion.p>
          </form>
        </div>

        {/* Right Section (Image/Illustration) */}
        <div className="hidden md:flex md:w-1/2 bg-blue-500 items-center justify-center p-8 rounded-r-2xl">
          <motion.img
            src="https://placehold.co/600x600/60A5FA/FFFFFF?text=Join+Us!"
            alt="Register Illustration"
            className="w-full h-auto max-w-md object-contain"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}