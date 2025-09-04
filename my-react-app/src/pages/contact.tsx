
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquareText, CheckCircle, AlertCircle } from 'lucide-react';

import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import { pageTitleVariants, sectionVariants, formItemVariants } from '../hooks/useAnimationVariants';
import { useContactMutation } from '../service/apiSlice';
import type { ContactFormData } from '../interfaces/types';

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  // Use the mutation hook to get the trigger function and the state
  const [submitForm, { isLoading, isSuccess, isError, reset }] = useContactMutation();
  
  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Calling the mutation function with the form data
      await submitForm(formData).unwrap();
      // Reset the form on successful submission
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Failed to submit the form: ', err);
    }
  };

  // Reset the success/error message after a few seconds
  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(() => {
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, reset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />
 
      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <motion.section
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={pageTitleVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <MessageSquareText className="w-10 h-10 mr-4 text-blue-600" /> Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We'd love to hear from you! Reach out to us for any inquiries, feedback, or support.
          </p>
        </motion.section>

        {/* Contact Information Section */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <motion.div className="bg-white rounded-xl shadow-lg p-6 text-center" variants={formItemVariants}>
            <div className="mb-4 p-3 bg-blue-100 rounded-full inline-flex items-center justify-center">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Office</h3>
            <p className="text-gray-700">123 Bus Lane, Travel City, TC 12345, Myanmar</p>
          </motion.div>

          <motion.div className="bg-white rounded-xl shadow-lg p-6 text-center" variants={formItemVariants}>
            <div className="mb-4 p-3 bg-green-100 rounded-full inline-flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-700">info@yandanarexpress.com</p>
          </motion.div>

          <motion.div className="bg-white rounded-xl shadow-lg p-6 text-center" variants={formItemVariants}>
            <div className="mb-4 p-3 bg-purple-100 rounded-full inline-flex items-center justify-center">
              <Phone className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-700">+95 9 123 456 789</p>
          </motion.div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          className="bg-white rounded-xl shadow-lg p-8 md:p-12 max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={formItemVariants}>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john.doe@example.com"
                required
              />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your message here..."
                required
              ></textarea>
            </motion.div>

            <motion.div variants={formItemVariants} className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md transition-all duration-300 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Send Message
                  </>
                )}
              </button>
            </motion.div>

            <AnimatePresence>
              {isSuccess && (
                <motion.p
                  className="text-center text-green-600 mt-4 font-semibold flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <CheckCircle className="w-5 h-5" /> Your message has been sent successfully! We will get back to you soon.
                </motion.p>
              )}
              {isError && (
                <motion.p
                  className="text-center text-red-600 mt-4 font-semibold flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <AlertCircle className="w-5 h-5" /> Failed to send message. Please try again later.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.section>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactUsPage;
