import { useEffect, useState } from 'react';
import AdminSidebar from '../components/adminNav';

import { CheckCircle, XCircle } from 'lucide-react'; // Icons for approve/reject buttons

interface Payment {
  id: number;
  booking_id: number;
  user_id: number;
  transaction_id: string;
  screenshot_path: string | null;
  submitted_at: string;
  status?: string; // Optional: if your backend returns current status
}

export default function AdminPaymentPreview() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const AdminId = localStorage.getItem('userId'); // Get admin's user_id
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/getmanualPayment.php`)
      .then(res => res.json())
      .then(data => setPayments(data.filter((p: Payment) => p.status === 'pending'))) // Filter for pending payments
      .catch(err => console.error("Error fetching payments:", err));
  }, []);

  const handleApprove = async (paymentId: number) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/payment/approvePayment.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: paymentId , userId: payments.find(p => p.id === paymentId)?.user_id , type:"Booking Update" ,title: "Booking Successful!" , message: "Your payment has been approved and your booking is confirmed!", admin_user_id: parseInt(AdminId!) }),
    });

    const result = await res.json();
    if (result.success) {
      setPayments(prev => prev.filter(p => p.id !== paymentId));
      alert('Payment approved successfully!');
    } else {
      alert(result.error || 'Approval failed.');
    }
  };

  const handleReject = async (paymentId: number) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/payment/rejectPayment.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: paymentId, userId: payments.find(p => p.id === paymentId)?.user_id , type:"Booking Fail" ,title: "Booking Rejected!" , message: "Your payment has been Rejected and your booking is not confirmed!" }),
    });

    const result = await res.json();
    if (result.success) {
      setPayments(prev => prev.filter(p => p.id !== paymentId));
      alert('Payment rejected successfully!');
    } else {
      alert(result.error || 'Rejection failed.');
    }
  };

  return (
    <AdminSidebar>
      <div className="container mx-auto mt-8 p-4"> {/* Replaced Container with a div */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📋</span> Manual Payment Submissions
        </h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden"> {/* Replaced Paper and TableContainer */}
          <table className="min-w-full leading-normal"> {/* Replaced Table */}
            <thead> {/* Replaced TableHead */}
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal"> {/* Replaced TableRow */}
                <th className="py-3 px-6 text-left">ID</th> {/* Replaced TableCell */}
                <th className="py-3 px-6 text-left">Booking ID</th>
                <th className="py-3 px-6 text-left">User ID</th>
                <th className="py-3 px-6 text-left">Transaction ID</th>
                <th className="py-3 px-6 text-left">Screenshot</th>
                <th className="py-3 px-6 text-left">Submitted At</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light"> {/* Replaced TableBody */}
              {payments.length === 0 ? (
                <tr className="border-b border-gray-200 hover:bg-gray-100"> {/* Replaced TableRow */}
                  <td colSpan={7} className="py-3 px-6 text-center whitespace-nowrap"> {/* Replaced TableCell */}
                    No payments submitted.
                  </td>
                </tr>
              ) : (
                payments.map((payment, i) => (
                  <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-100"> {/* Replaced TableRow */}
                    <td className="py-3 px-6 text-left whitespace-nowrap">{i + 1}</td> {/* Replaced TableCell */}
                    <td className="py-3 px-6 text-left">{payment.booking_id}</td>
                    <td className="py-3 px-6 text-left">{payment.user_id}</td>
                    <td className="py-3 px-6 text-left">{payment.transaction_id}</td>
                    <td className="py-3 px-6 text-left">
                      {payment.screenshot_path ? (
                        <a
                          href={`${import.meta.env.VITE_IMAGE_BASE_URL}/${payment.screenshot_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 hover:underline" // Replaced Link with a tag, added Tailwind for styling
                        >
                          View
                        </a>
                      ) : (
                        'No file'
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">{new Date(payment.submitted_at).toLocaleString()}</td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex space-x-2"> {/* Replaced Stack with a div for flex layout */}
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-xs inline-flex items-center" // Replaced Button with native button, added Tailwind for styling
                          onClick={() => handleApprove(payment.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs inline-flex items-center" // Replaced Button with native button, added Tailwind for styling
                          onClick={() => handleReject(payment.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminSidebar>
  );
}