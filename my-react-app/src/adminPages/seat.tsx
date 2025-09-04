import { useState, useEffect } from 'react';
import AdminSidebar from '../components/adminNav';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'; // Import icons for messages
import type { Schedules } from '../interfaces/types';



export default function SeatGenerator() {
  const [schedules, setSchedules] = useState<Schedules[]>([]); // Changed from buses to schedules
// console.log(schedules);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [form, setForm] = useState({
    schedule_id: '', // Changed from bus_id to schedule_id
    num_rows: '',
    seats_per_row: ''
  });




  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [submitting, setSubmitting] = useState(false);
   const fetchSchedules = async () => {
      setLoadingSchedules(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/seat/seatSchRead.php`); // New API endpoint
        const data = await res.json();
        console.log(data); // Log the fetched data for debugging
        if (res.ok && Array.isArray(data)) {
          setSchedules(data);
        } else {
          setMessage(data.message || 'Failed to load schedules.');
          setMessageType('error');
          setSchedules([]);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setMessage('An error occurred while fetching schedules.');
        setMessageType('error');
      } finally {
        setLoadingSchedules(false);
      }
    };
  useEffect(() => {
    fetchSchedules();
  }, []);

 const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "schedule_id") {
    // Find the selected schedule
    const selectedSchedule = schedules.find(s => String(s.schedule_id) === value);
    if (selectedSchedule && selectedSchedule.total_seats) {
      // Auto calculate rows and seats per row
      const seatsPerRow = 4; // fixed
      const rows = selectedSchedule.total_seats / seatsPerRow;
      setForm({
        ...form,
        schedule_id: value,
        num_rows: String(rows),
        seats_per_row: String(seatsPerRow)
      });
      return;
    }
  }

  setForm({ ...form, [name]: value });
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setMessageType('');
    fetchSchedules();

    if (!form.schedule_id || !form.num_rows || !form.seats_per_row) {
        setMessage('Please fill all fields.');
        setMessageType('error');
        setSubmitting(false);
        return;
    }
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/seat/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          schedule_id: parseInt(form.schedule_id), // Ensure schedule_id is an integer
          num_rows: parseInt(form.num_rows),
          seats_per_row: parseInt(form.seats_per_row)
      })
    });

    const result = await res.json();
    if (result.success) { // Changed from result.status to result.success
      setMessage(result.message);
      setMessageType('success');
      setForm({ schedule_id: '', num_rows: '', seats_per_row: '' });
    } else {
      setMessage(result.message || 'Error occurred');
      setMessageType('error');
    }
    setSubmitting(false);
  };

  return (
    <AdminSidebar>
      <div className="container mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Seats for Schedule</h2>
        
        {message && (
            <div className={`p-3 rounded-md mb-4 flex items-center gap-2 ${
                messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
                {messageType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message}
            </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label htmlFor="schedule_id" className="block text-sm font-medium text-gray-700 mb-1">Select Schedule:</label>
            {loadingSchedules ? (
                <div className="flex items-center justify-center p-2 border border-gray-300 rounded-md bg-gray-50">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" /> Loading Schedules...
                </div>
            ) : schedules.length === 0 ? (
                <div className="p-2 text-sm text-gray-600 border border-gray-300 rounded-md bg-gray-50">
                    No schedules available.
                </div>
            ) : (
                <select
    id="schedule_id"
    className="form-select w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    name="schedule_id"
    value={form.schedule_id}
    onChange={handleChange}
    required
>
    <option value="">Select Schedule</option>
    {schedules.map((s) => (
        <option
  key={s.schedule_id}
  value={s.schedule_id}
  disabled={s.generated_seats > 0}
>
  Bus {s.bus_number} ({s.start_location} → {s.end_location}) - { !s.generated_seats ? s.total_seats :''} seats
  {s.generated_seats > 0 ? ` - ${s.generated_seats}  generated` : ''}  
</option>

    ))}
</select>

            )}
          </div>
          <div className="md:col-span-1">
            <label htmlFor="num_rows" className="block text-sm font-medium text-gray-700 mb-1">Number of Rows (A-Z):</label>
            <input
              type="number"
              id="num_rows"
              name="num_rows"
              className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rows (e.g., 7 for A-G)"
              value={form.num_rows}
              onChange={handleChange}
              min={1}
              max={10} // Increased max rows for flexibility
              required
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="seats_per_row" className="block text-sm font-medium text-gray-700 mb-1">Seats per Row:</label>
            <input
              type="number"
              id="seats_per_row"
              name="seats_per_row"
              className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Seats per row (e.g., 4)"
              value={form.seats_per_row}
              onChange={handleChange}
              min={1}
              max={6} // Increased max seats per row for flexibility
              required
            />
          </div>
          <div className="md:col-span-4 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={submitting || loadingSchedules}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                </>
              ) : (
                'Generate Seats'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminSidebar>
  );
}
