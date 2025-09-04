/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../components/nav';
import { BusFront, CircleDotDashed, CircleCheck, CircleX, Users, DollarSign ,Trash2, XCircle } from 'lucide-react'; // Added DollarSign icon
import Footer from '../components/Footer';
//import type { BookingInfo, Seat, Schedules } from '../interfaces/types';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../store';
import { setPassengerCount, toggleSeat ,clearSeats } from "../service/seatSlice";
import type { Seat, Schedules } from '../interfaces/types';
import { useBookSeatsMutation, useGetScheduleSeatsQuery } from '../service/apiSlice';
export default function Book() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  

  // Retrieve passengerCount and travellerType from URL search parameters
  const searchParams = new URLSearchParams(location.search);
  const requestedPassengerCount = parseInt(searchParams.get('passengerCount') || '1', 10);
  const travellerType = (searchParams.get('travellerType') as 'local' | 'foreign') || 'local'; // Get travellerType
  const passengerType = (searchParams.get('passengerType'))
  // Exchange rate for demonstration (1 USD = 3500 MMK)
  const MMK_TO_USD_RATE = 3500;

  const [schedule, setSchedule] = useState<Schedules | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
 
  const { data, error, isLoading } = useGetScheduleSeatsQuery({id: id!}, { skip: !id });
  const [bookSeats, { isLoading: isBooking }] = useBookSeatsMutation();
    
  useEffect(() => {
    if (data) {
      setSchedule(data.schedule);
      setSeats(data.seats);
    }
  }, [data]);


 const dispatch = useDispatch();
  const { selectedSeats, passengerCount } = useSelector(
    (state: RootState) => state.seat
  );

  const handleToggle = (id: number, number: string) => {
    dispatch(toggleSeat({ id, number }));
  };
  
 const  handleAllDelete = ()=>{
   dispatch(clearSeats())
 }


  useEffect(() => {
  // URL ကထုတ်ယူထားတဲ့ passengerCount ကို Redux store ထဲ update
  dispatch(setPassengerCount(requestedPassengerCount));
}, [requestedPassengerCount, dispatch]);



const handleBook = async () => {
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat.");
    return;
  }
if (selectedSeats.length !== passengerCount) {
  alert(`Please select exactly ${passengerCount} seat(s) to proceed.`);
  return;
}


  try {
    const seatIds = selectedSeats.map((s) => s.id); // ✅ only IDs
    const res = await bookSeats({ id: id!, selected_seats: seatIds }).unwrap();

    navigate(`/travel-info/${res.booking_id}?travellerType=${travellerType}&passengerType=${passengerType}`);
  } catch (err: any) {
    alert(err?.data?.error || "Failed to book seats. Please try again.");
    if (err?.status === 401) {
      navigate("/login");
    }
  }
};

  // Function to format price based on traveller type
  const formatPrice = (priceInMMK: number ) => {
    if (travellerType === 'foreign') {
      const priceInUSD = priceInMMK / MMK_TO_USD_RATE;
      return `${priceInUSD.toFixed(2)} USD`; // Format to 2 decimal places for USD
    }
    return `${priceInMMK.toLocaleString()} MMK`; // Format with commas for MMK
  };

  if (!schedule) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load schedule details. Please try again later.</p>
      </div>
    );
  }

  if(isLoading || isBooking){
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

 const totalPrice = schedule.price * requestedPassengerCount;

  return (
    <>
      <UserNavbar />

      <div className=" mb-3 mt-3">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-7">
       
           <div className='grid grid-cols-1 md:grid-cols-2   '>

            <div className=''>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <BusFront className="w-8 h-8 mr-3 text-blue-600" /> {schedule.bus_number} ({schedule.bus_type})
          </h2>
          <p className="text-gray-700 text-lg mb-1">{schedule.start_location} &rarr; {schedule.end_location}</p>
          <p className="text-gray-600 mb-1">Departure: {new Date(schedule.departure_time).toLocaleString()}</p>

          {/* Display Price based on Traveller Type */}
          <p className="text-xl font-bold text-green-700 flex items-center">
            Price per seat:
            {travellerType === 'foreign' ? (
              <DollarSign className="inline-block w-6 h-6 ml-2 mr-1" />
            ) : (
              <span className="ml-2 mr-1"></span> // Placeholder for MMK
            )}
            {formatPrice(schedule.price)}
          </p>

          <p className="text-gray-700 text-lg mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-gray-500" /> Requested Passengers: <span className="font-semibold ml-1">{requestedPassengerCount}</span>
          </p>
           </div>
            <div className='grid grid-cols-3 '>
             
                 {selectedSeats.map((seat, i) => (
                  <div className=' '>
       <button 
    key={i} 
    className="bg-green-100 border flex justify-center items-center gap-2 border-green-500 px-3 py-2 m-2 rounded "
     >
     {seat.number}   
    <Trash2 
      className='text-red-600'  
      onClick={() => handleToggle(seat.id, seat.number)}
    />
  </button> 
  </div>
))}


            </div>
              
          </div>
          <div className="mt-8">
            <div className='flex justify-between mb-3'>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Select Your Seats</h3>
             <button onClick={()=>handleAllDelete()} className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-1 flex-grow sm:flex-grow-0"><XCircle className="w-4 h-4" /> Clear All</button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-4 gap-3 max-w-sm mx-auto">
              {seats.map((seat) => {
                const isBooked = seat.is_booked === 1 || seat.is_booked === "1";
                const isSelected = selectedSeats.some((s) => s.id === seat.seat_id);


                const buttonClasses = "py-3 px-2 rounded-md font-semibold text-sm transition-colors duration-200 w-full";
                let buttonColorClasses = "bg-blue-500 hover:bg-blue-600 text-white"; // Available
                if (isBooked) {
                  buttonColorClasses = "bg-red-500 text-white cursor-not-allowed"; // Booked
                } else if (isSelected) {
                  buttonColorClasses = "bg-green-500 hover:bg-green-600 text-white"; // Selected
                }

                return (
                  <button
                    key={seat.seat_id}
                    className={`${buttonClasses} ${buttonColorClasses}`}
                    onClick={() => handleToggle(seat.seat_id , seat.seat_number )}
                    disabled={isBooked}
                  >
                    {seat.seat_number}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center space-x-6 text-gray-700 font-medium text-sm">
              <div className="flex items-center">
                <CircleX className="w-5 h-5 mr-2 text-red-500" /> Booked
              </div>
              <div className="flex items-center">
                <CircleCheck className="w-5 h-5 mr-2 text-green-500" /> Selected
              </div>
              <div className="flex items-center">
                <CircleDotDashed className="w-5 h-5 mr-2 text-blue-500" /> Available
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-xl font-bold text-gray-800 mb-4">
              Total Price:
              {travellerType === 'foreign' ? (
                <DollarSign className="inline-block w-6 h-6 ml-2 mr-1" />
              ) : (
                <span className="ml-2 mr-1"></span> // Placeholder for MMK
              )}
              {formatPrice(totalPrice)}
            </p>
            <button  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBook}
             disabled={selectedSeats.length === 0 || selectedSeats.length !== passengerCount}
            >
  Select Seat ({selectedSeats.length} / {passengerCount} seats)
                 </button>

          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
