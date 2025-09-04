/* eslint-disable no-irregular-whitespace */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search   } from 'lucide-react';
import { locationOptions, passengerTypeOptions } from '../constants/locations';
import { useForm, type SubmitHandler ,  useController} from 'react-hook-form'; // Import SubmitHandler
import { zodResolver } from '@hookform/resolvers/zod';
import { heroVariants, formVariants } from '../hooks/useAnimationVariants'; // Assuming these are defined as Variants
import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import HomeFeatures from '../components/ui/HomeFeatures';
import PopularRoutes from '../components/ui/PopularRoutes';
import CallAction from '../components/ui/CallAction';
import { formSchema ,type FormData } from '../schemas/formSchemas';
import type { RawFormInput } from '../interfaces/types';
import '../styles/home.css'
import image from "../../public/e4e8a55.app-hero-illustration.svg"
import Benefit from '../components/ui/Benefit';
import Select from 'react-select'



const Home: React.FC = () => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RawFormInput,FormData>({ resolver: zodResolver(formSchema),
    defaultValues: {
      from: '',
      to: '',
      date: new Date().toISOString().split("T")[0],
      passengerCount: '1', // Default value must match RawFormInput type (string)
      passengerType: '',
      travellerType: 'local'
    },
  });
   
 
   
  // Watch the activeTab state, it's not part of the form so useState is fine
  const [activeTab, setActiveTab] = React.useState<'bus' | 'car'>('bus');

  const navigate = useNavigate();
  // The onSubmit handler now correctly expects the transformed FormData type

  const onSubmit: SubmitHandler<FormData> = (data) => {

    const queryParams = new URLSearchParams(data as Record<string, string>).toString();
    navigate(`/search-results?${queryParams}`);
  }; 
  
 const { field: fromField } = useController({
    name: 'from',
    control,
    defaultValue: '', // Default value for the 'from' field
  });

  // FIX: This section has been updated to use react-select with useController for the 'to' field.
  const { field: toField } = useController({
    name: 'to',
    control,
    defaultValue: '',
  });

  const { value: fromValue, onChange: fromOnChange, ...fromRest } = fromField;
  const { value: toValue, onChange: toOnChange, ...toRest } = toField;

  return (
    <>
      <UserNavbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100  text-gray-800 ">
             <div className="relative overflow-hidden ">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center ">
                  {/* Left Content */}
                  <div className="space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                       <h1 className="toe   sm:text-6xl font-bold text-gray-900 font-serif" >
                        Find cheap bus tickets for your next trip
                      </h1>
                      <p className="text-xl  text-gray-600 text-center  ">
                        Easily compare and book your next trip with Yadanar Express
                      </p>
                    </motion.div>
      
                   
                  </div>
      
                  {/* Right Illustration */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative bg-amber-700 mt-3"
                  >
                    <div className="relative  ">
                      
                      <motion.div
                      
                        className="absolute   w-full h-16  bg-blue-600 flex items-center justify-center"
                      >
                        <img src={image} alt="" className='object-cover' />
                      </motion.div>

                    </div>
                  </motion.div>
                </div>
              </div>
             </div>

             <div className='border-b'>
           <motion.div className="max-w-6xl mx-auto px-4 mb-3   sm:px-6 lg:px-8 mt-8 relative z-10 " initial="hidden" animate="visible" variants={heroVariants}>


            <motion.div className="bg-white rounded-2xl shadow-xl p-6" initial="hidden" animate="visible" variants={formVariants}>
              <div className="flex justify-center mb-6 border-b border-gray-200">
                <button className={`py-3 px-6 text-lg font-semibold transition-colors duration-300 ${activeTab === 'bus' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`} onClick={() => setActiveTab('bus')}>Express Bus</button>
                <button className={`py-3 px-6 text-lg font-semibold transition-colors duration-300 ${activeTab === 'car' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'} relative`} onClick={() => setActiveTab('car')}>
                  Small Car <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'bus' && (
                  <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 ">
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3" >
                       {/* From Location */}
                       <div className="relative">
                       <Select
                        id="from" // Added ID for label association
                        className={`w-full py-2 border px-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-700 ${errors.from ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                        options={locationOptions}
                        value={locationOptions.find(option => option.value === fromValue)}
                        onChange={(option) => fromOnChange(option?.value || '')}
                        placeholder="Select..."
                        isClearable
                        {...fromRest}
                      />
                      <label htmlFor="from" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">From</label>
                      {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>}
                    </div>


                    {/* To Location - Updated to use react-select */}
                    <div className="relative">
                      <Select
                        id="to"
                        className={`w-full py-2 border px-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-700 ${errors.to ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                        options={locationOptions}
                        value={locationOptions.find(option => option.value === toValue)}
                        onChange={(option) => toOnChange(option?.value || '')}
                        placeholder="Select..."
                        isClearable
                        {...toRest}
                      />
                     
                      <label htmlFor="to" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">To</label>
                      {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>}
                    </div>

                    {/* Date */}
                    <div className="relative">
                      <input
                        id="date" // Added ID for label association
                        type="date"
                        min={new Date().toISOString().split("T")[0]} // Ensures minimum date is today
                        className={`w-full pl-5 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white text-gray-700 ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                        {...register('date')}
                      />
                     
                      <label htmlFor="date" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">Travel Date</label>
                      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                    </div>

                    {/* Passenger Count */}
                    <div className="relative">
                      <select
                        id="passengerCount" // Added ID for label association
                        className={`w-full pl-5 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 appearance-none bg-white text-gray-700 ${errors.passengerCount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                        {...register('passengerCount')} // No valueAsNumber here, Zod transform handles it
                      >
                        {[...Array(10).keys()].map((n) => (
                          <option key={n + 1} value={String(n + 1)}>{n + 1} Passenger{n > 0 ? 's' : ''}</option>
                        ))}
                      </select>
                     
                      <label htmlFor="passengerCount" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">Passengers</label>
                      {errors.passengerCount && <p className="text-red-500 text-sm mt-1">{errors.passengerCount.message}</p>}
                    </div>

                    {/* Passenger Type */}
                    <div className="relative">
                      <select
                        id="passengerType" // Added ID for label association
                        className={`w-full pl-5 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 appearance-none bg-white text-gray-700 ${errors.passengerType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                        {...register('passengerType')}
                      >
                        <option value="" disabled>Select Passenger Type</option>
                        {passengerTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                     
                      <label htmlFor="passengerType" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">Passenger Type</label>
                      {errors.passengerType && <p className="text-red-500 text-sm mt-1">{errors.passengerType.message}</p>}
                    </div>

                        {/* Submit Button */}
                         <div className='relative  '>
                    <div className="md:col-span-3 flex justify-center   " >
                      <button type='submit'  className="bg-blue-600  rounded text-white pl-5 pr-4 py-3 cursor-pointer   text-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center gap-2">
                        <Search className="w-5 h-5" /> Search Now
                      </button>
                    </div>
                    </div>
                     </div>
                  </form>
                )}
                {activeTab === 'car' && (
                  <div className="p-4 text-center text-red-500 text-lg font-medium">
                    Small car booking will be available soon.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
           </div>


          <Benefit />
        <HomeFeatures />
        <PopularRoutes />
        <CallAction />
        <Footer />
      </div>
    </>
  );
};

export default Home;
