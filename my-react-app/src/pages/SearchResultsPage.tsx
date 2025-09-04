/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SearchResultsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MapPin, CalendarDays, Clock, Filter, SortAsc, SortDesc,
    Search, Users, Earth, User2, UserCheck, Calendar as CalendarIcon, DollarSign, XCircle
} from 'lucide-react';
import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import { useSearchState } from '../hooks/useSearchState'; // Import the new hook
import { loadingSpinnerVariants, sectionTitleVariants, containerVariants, itemVariants } from '../hooks/useAnimationVariants';
import { passengerTypeOptions, priceRangeOptions, busTypeOptions, locationOptions } from '../constants/locations';


const SearchResultsPage = () => {
    const {
        form,
        setForm,
        selectedFilters,
        setSelectedFilters,
        buses,
        isLoading,
        isFetching,
        isError,
        error,
        skipFetch,
    } = useSearchState();

    const MMK_TO_USD_RATE = 2100;
    const now = new Date();
    const filteredBuses = buses.filter((b) => new Date(b.departure_time) > now);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prevForm: any) => ({
            ...prevForm,
            [name]: name === 'passengerCount' ? parseInt(value, 10) : value,
        }));
    };

    const handleTravellerTypeChange = (type: 'local' | 'foreign') => {
        setForm((prevForm: any) => ({ ...prevForm, travellerType: type }));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>, filterName: 'busType' | 'priceRange' | 'passengerType') => {
        setSelectedFilters((prevFilters: any) => ({
            ...prevFilters,
            [filterName]: e.target.value,
        }));
    };

    const handleSortByChange = (criteria: 'departure_time' | 'price') => {
        setSelectedFilters((prevFilters:any) => ({
            ...prevFilters,
            sortBy: criteria,
            sortOrder: prevFilters.sortBy === criteria && prevFilters.sortOrder === 'ASC' ? 'DESC' : 'ASC',
        }));
    };

    const handleClearFilters = () => {
        setSelectedFilters((prevFilters: any) => ({
            ...prevFilters,
            busType: '',
            priceRange: '',
            passengerType: '',
        }));
    };

    const handleClearSort = () => {
        setSelectedFilters((prevFilters: any) => ({
            ...prevFilters,
            sortBy: null,
            sortOrder: 'ASC',
        }));
    };

    const formatPrice = (priceInMMK: number) => {
        if (form.travellerType === 'foreign') {
            const priceInUSD = priceInMMK / MMK_TO_USD_RATE;
            return `${priceInUSD.toFixed(2)} USD`;
        }
        return `${priceInMMK.toLocaleString()} MMK`;
    };

    const getLoadingMessage = () => {
        const from = locationOptions.find(o => o.value === form.from)?.label || form.from;
        const to = locationOptions.find(o => o.value === form.to)?.label || form.to;
        return `Searching for buses from ${from} to ${to} on ${form.date} for ${form.travellerType} travellers (Passengers: ${form.passengerCount}, Type: ${form.passengerType})...`;
    };

    const getErrorMessage = () => {
        const displayError = isError ? (error as any)?.data?.message || (error as any)?.message || 'An unknown error occurred.' : null;
        return displayError;
    };

    const getNoResultsMessage = () => {
        const from = locationOptions.find(o => o.value === form.from)?.label || form.from;
        const to = locationOptions.find(o => o.value === form.to)?.label || form.to;
        return `We couldn't find any buses from ${from} to ${to} for ${form.date} with ${form.passengerCount} passengers of type ${form.passengerType}. Please try a different search.`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
            <UserNavbar />
            <div className="container mx-auto py-8 px-4 md:px-6">
                <motion.div
                    className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-6 md:p-8 text-gray-800 backdrop-blur-sm mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.6, ease: [0.2, 1, 0.3, 1] } },
                    }}
                >
                    <form onSubmit={e => e.preventDefault()} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {/* Form inputs... (same as before) */}
                        <div className="relative">
                            <select name="from" id='from' value={form.from} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700" required>
                                <option value="" disabled>Select Departure Location</option>
                                {locationOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-500" /></div>
                            <label htmlFor="from" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">From</label>
                        </div>
                        <div className="relative">
                            <select name="to" id='to' value={form.to} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700" required>
                                <option value="" disabled>Select Destination Location</option>
                                {locationOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-500" /></div>
                            <label htmlFor="to" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">To</label>
                        </div>
                        <div className="relative">
                            <input type="date" name="date" value={form.date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700" required />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CalendarIcon className="h-5 w-5 text-gray-500" /></div>
                            <label htmlFor="date" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">Travel Date</label>
                        </div>
                        <div className="relative">
                            <select name="passengerCount" id='passengerCount' value={form.passengerCount} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700">
                                {[...Array(10).keys()].map((n) => (<option key={n + 1} value={n + 1}>{n + 1} Passenger{n > 0 ? 's' : ''}</option>))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Users className="h-5 w-5 text-gray-500" /></div>
                            <label htmlFor="passengerCount" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">Passengers</label>
                        </div>
                        <div className="relative">
                            <select name="passengerType" id='passengerType' value={form.passengerType} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700" required>
                                {passengerTypeOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserCheck className="h-5 w-5 text-gray-500" /></div>
                            <label htmlFor="passengerType" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 pointer-events-none">Passenger Type</label>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-5 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 mt-6">
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="radio" name="travellerType" value="local" checked={form.travellerType === 'local'} onChange={() => handleTravellerTypeChange('local')} className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500" />
                                <span className="text-gray-700 font-medium flex items-center gap-1"><User2 className="h-5 w-5" /> Local Traveller</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="radio" name="travellerType" value="foreign" checked={form.travellerType === 'foreign'} onChange={() => handleTravellerTypeChange('foreign')} className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500" />
                                <span className="text-gray-700 font-medium flex items-center gap-1"><Earth className="h-5 w-5" /> Foreign Traveller</span>
                            </label>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-5 flex justify-center mt-8">
                            <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 w-full max-w-sm justify-center">
                                <Search className="w-5 h-5" /> Search Now
                            </button>
                        </div>
                    </form>
                </motion.div>
                {/* Filters and Sort Section */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-xl shadow-md p-4 mb-8">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-gray-700 font-medium mb-4 md:mb-0">
                        <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <span className="flex-shrink-0">Filter By:</span>
                        <div className="relative">
                            <select value={selectedFilters.busType} onChange={e => handleFilterChange(e, 'busType')} className="px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors appearance-none pr-8 cursor-pointer">
                                {busTypeOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                            </select>
                            {selectedFilters.busType && (<button type="button" onClick={handleClearFilters} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full" title="Clear Bus Type Filter"><XCircle className="w-4 h-4" /></button>)}
                        </div>
                        <div className="relative">
                            <select value={selectedFilters.priceRange} onChange={e => handleFilterChange(e, 'priceRange')} className="px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors appearance-none pr-8 cursor-pointer">
                                {priceRangeOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                            </select>
                            {selectedFilters.priceRange && (<button type="button" onClick={handleClearFilters} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full" title="Clear Price Range Filter"><XCircle className="w-4 h-4" /></button>)}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-gray-700 font-medium">
                        <SortAsc className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <span className="flex-shrink-0">Sort By:</span>
                        <button onClick={() => handleSortByChange('departure_time')} className={`px-3 py-2 rounded-md transition-colors flex-grow sm:flex-grow-0 flex items-center gap-1 ${selectedFilters.sortBy === 'departure_time' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                            Departure Time {selectedFilters.sortBy === 'departure_time' && (selectedFilters.sortOrder === 'ASC' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
                        </button>
                        <button onClick={() => handleSortByChange('price')} className={`px-3 py-2 rounded-md transition-colors flex-grow sm:flex-grow-0 flex items-center gap-1 ${selectedFilters.sortBy === 'price' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                            Price {selectedFilters.sortBy === 'price' && (selectedFilters.sortOrder === 'ASC' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
                        </button>
                        {(selectedFilters.sortBy || selectedFilters.busType || selectedFilters.priceRange || selectedFilters.passengerType) && (<button type="button" onClick={() => { handleClearFilters(); handleClearSort(); }} className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-1 flex-grow sm:flex-grow-0" title="Clear All Filters and Sort"><XCircle className="w-4 h-4" /> Clear All</button>)}
                    </div>
                </div>
                {/* Display Search Results or Messages */}
                {(isLoading || isFetching) ? (
                    <motion.div className="flex flex-col items-center justify-center h-64 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <motion.div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" variants={loadingSpinnerVariants} animate="animate"></motion.div>
                        <p className="mt-4 text-lg text-gray-600 ">{getLoadingMessage()}</p>
                    </motion.div>
                ) : getErrorMessage() ? (
                    <motion.div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative text-center" role="alert" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {getErrorMessage()}</span>
                        {skipFetch && (<Link to="/" className="block mt-2 text-blue-600 no-underline hover:underline">Go back to Home to provide search details.</Link>)}
                    </motion.div>
                ) : filteredBuses.length === 0 && !skipFetch ? (
                    <div className='h-screen '>
                        <motion.div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md relative text-center " role="alert" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <strong className="font-bold">No Buses Found!</strong>
                            <span className="block sm:inline"> {getNoResultsMessage()}</span>
                            <Link to="/" className="block mt-2 text-blue-600 no-underline hover:underline">Go back to Home to search again.</Link>
                        </motion.div>
                    </div>
                ) : skipFetch ? (
                    <motion.div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md relative text-center" role="alert" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <strong className="font-bold">Please enter search details!</strong>
                        <span className="block sm:inline"> Fill in the "From", "To", "Travel Date", "Passengers", and "Passenger Type" fields to find bus schedules.</span>
                    </motion.div>
                ) : (
                    <>
                        <motion.h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8" initial="hidden" animate="visible" variants={sectionTitleVariants}>
                            {filteredBuses.length} Results for <span className="text-blue-600">{locationOptions.find(o => o.value === form.from)?.label || form.from}</span> to <span className="text-blue-600">{locationOptions.find(o => o.value === form.to)?.label || form.to}</span> on <span className="text-blue-600">{form.date}</span>
                        </motion.h3>
                        <motion.div className="grid grid-cols-1 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                            {filteredBuses.map((bus: { schedule_id: React.Key | null | undefined; image: any; departure_time: string | number | Date; bus_type: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; start_location: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; end_location: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; arrival_time: string | number | Date; price: number; }) => (
                                <motion.div key={bus.schedule_id} variants={itemVariants} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row">
                                    <div className="flex-shrink-0">
                                        <img src={bus.image ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${bus.image}` : 'https://placehold.co/400x300/E0E7FF/3B82F6?text=Bus+Image'} alt="Bus" className="w-96 md:h-full rounded-t-xl md:rounded-t-none md:rounded-l-xl" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/E0E7FF/3B82F6?text=Bus+Image'; }} />
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-blue-700 mb-2">{new Date(bus.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {bus.bus_type}</h3>
                                            <p className="text-gray-600 text-sm mb-3">{bus.description}</p>
                                            <div className="flex items-center text-gray-700 text-lg mb-1"><MapPin className="w-5 h-5 mr-2 text-gray-500" /><span className="font-semibold">{bus.start_location}</span> &rarr; <span className="font-semibold">{bus.end_location}</span></div>
                                            <p className="text-gray-600 text-sm mb-1 flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-500" /> Departs: {new Date(bus.departure_time).toLocaleString()}</p>
                                            <p className="text-gray-600 text-sm mb-4 flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-gray-500" /> Estimated Arrives Time: {new Date(bus.arrival_time).toLocaleString()}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t border-gray-200">
                                            <div className="text-2xl font-bold text-green-600 flex items-center mb-3 sm:mb-0"><DollarSign className="w-6 h-6 mr-2" /> {formatPrice(bus.price)}</div>
                                            <Link style={{ textDecoration: 'none' }} to={`/book/${bus.schedule_id}?from=${form.from}&to=${form.to}&date=${form.date}&travellerType=${form.travellerType}&passengerCount=${form.passengerCount}&passengerType=${form.passengerType}`} className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition-all duration-300 text-center whitespace-nowrap no-underline">
                                                Select Trip
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SearchResultsPage;