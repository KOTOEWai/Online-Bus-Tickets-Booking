import { useState, type ChangeEvent, type FormEvent } from 'react';
import {  useLocation, useParams } from 'react-router-dom';

import UserNavbar from '../components/nav';
import React from 'react'; // Ensure React is imported
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function PaymentPage() {
  const navigate = useNavigate();
  // Explicit type annotation for params
  const { id } = useParams<{ id: string }>();
const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
 const travellerType = (queryParams.get('travellerType') as 'local' | 'foreign') || 'local';

  const [transactionId, setTransactionId] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    // Use optional chaining and nullish coalescing for safety if id could be undefined,
    // though useParams<{ id: string }>() implies it will be a string.
    formData.append('booking_id', id ?? '');
    formData.append('transaction_id', transactionId);
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/manualPayment.php`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      );
      const data: { success: boolean; error?: string } = await res.json();

      if (data.success) {
        setTimeout(() => {
          setMessage('✅ Payment submitted successfully. Waiting for admin approval.');
        }, 9000); // Adjusted delay for better UX
       
          navigate('/profileDetail'); // Redirect to home page after successful submission
        // Optionally clear form fields on success
        setTransactionId('');
        setScreenshot(null);
        // Reset file input if possible (requires ref or re-rendering)
        const fileInput = document.getElementById('screenshot-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

      } else {
        setMessage('❌ ' + (data.error || 'Unknown error occurred.'));
      }
    } catch (err) {
      console.error("Payment submission error:", err); // Log the actual error
      setMessage('❌ Network error. Please try again later.');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setScreenshot(e.target.files?.[0] || null);
  };

  return (
    <>
      <UserNavbar />
       <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
        

        {/* Replaced Grid container with flexbox and responsive classes */}
        <div className="flex flex-wrap justify-center items-center -mx-2 mb-6">
          {/* KBZPay QR - Replaced Grid item with div */}
          {travellerType === 'local' ? ( 
            <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Scan & Pay with KBZPay or Wave Money
        </h2>
          <div className="w-full sm:w-1/2 px-2 text-center ">
            <p className="font-medium text-lg mb-2">KBZPay</p>
            <img
              src={`${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/kpay.webp`}
              alt="KBZPay QR"
              className="w-3/4 max-w-[200px] mt-1 mx-auto rounded-lg shadow-md"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = 'https://placehold.co/200x200/E0E7FF/3B82F6?text=KBZPay+QR'; // Fallback image
              }}
            />
          </div>

        
          <div className="w-full sm:w-1/2 px-2 text-center">
            <p className="font-medium text-lg mb-2">Wave Money</p>
            <img
              src={`${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/wpay.jpg`}
              alt="Wave Money QR"
              className="w-3/4 max-w-[200px] mt-1 mx-auto rounded-lg shadow-md"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = 'https://placehold.co/200x200/E0E7FF/3B82F6?text=Wave+Money+QR'; // Fallback image
              }}
            />
          </div>
          </>
          ):(
            <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Scan & Pay with Pay Pal
            </h2>
             <div className="w-full sm:w-1/2 px-2 text-center">

            <p className="font-medium text-lg mb-2">Pay Pal</p>
            <img
              src={`${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/paypal-qr-code.webp`}
              alt="Wave Money QR"
              className="w-3/4 max-w-[200px] mt-1 mx-auto rounded-lg shadow-md"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = 'https://placehold.co/200x200/E0E7FF/3B82F6?text=Wave+Money+QR'; // Fallback image
              }}
            />
          </div>
          </>
          )}
          
        </div>

        {/* Replaced Box component="form" with form tag */}
        <form onSubmit={handleSubmit} className="mt-8">
          {/* Replaced TextField with input */}
          <div className="mb-4">
            <label htmlFor="transaction-id" className="block text-gray-700 text-sm font-bold mb-2">
              Transaction ID / Reference Number
            </label>
            <input
              id="transaction-id"
              type="text"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter transaction ID"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>

          {/* Replaced FormControl with div */}
          <div className="mb-6">
            <label htmlFor="screenshot-upload" className="block text-gray-700 text-sm font-bold mb-2">
              Upload Proof of Payment (Screenshot)
            </label>
            {/* Replaced Input with input type="file" */}
            <input
              id="screenshot-upload"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
            />
            {/* Replaced FormHelperText with p tag */}
            <p className="mt-2 text-sm text-gray-500">Optional: Upload a screenshot of your successful transaction.</p>
          </div>

          {/* Replaced Button with button tag */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-lg transition duration-300 ease-in-out focus:outline-none focus:shadow-outline"
          >
            Submit Payment
          </button>
        </form>

        {/* Replaced Alert with div */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
