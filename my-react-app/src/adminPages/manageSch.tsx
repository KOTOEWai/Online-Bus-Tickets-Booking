// ManageSchedule.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../components/adminNav"; // Assuming this component exists
import React from "react";

// Define interfaces for your data structures
interface Bus {
  bus_id: string;
  bus_number: string;
  bus_type: string; // Assuming bus_type is a property in your API response
  // Add other bus properties if they exist in your API response
}

interface Route {
  route_id: string;
  start_location: string;
  end_location: string;
  // Add other route properties if they exist in your API response
}

interface Schedule {
  schedule_id: string;
  bus_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  price: string;
  bus_number?: string; // Optional, as it might be joined from bus data
  start_location?: string; // Optional, as it might be joined from route data
  end_location?: string; // Optional, as it might be joined from route data
  Generated_seats?: number; // Optional, as it might be joined from seat data
}

interface ScheduleForm {
  bus_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  price: string;
}

export default function ManageSchedule() {
  // State to hold fetched schedules, buses, and routes
  const [schedules, setSchedules] = useState<Schedule[]>([]);
 
  const [buses, setBuses] = useState<Bus[]>([]);
  
  const [routes, setRoutes] = useState<Route[]>([]);

  // State for messages (success/error)
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  // State for the form input fields
  const [form, setForm] = useState<ScheduleForm>({
    bus_id: '',
    route_id: '',
    departure_time: '',
    arrival_time: '',
    price: ''
  });

  // State for the custom confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [scheduleToDeleteId, setScheduleToDeleteId] = useState<string | null>(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetches bus, route, and schedule data from the backend APIs.
   */
  const fetchData = async () => {
    try {
      const [busRes, routeRes, schRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/bus/read.php`).then(res => res.json()),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/routes/read.php`).then(res => res.json()),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/schedules/read.php`).then(res => res.json())
      ]);
      setBuses(busRes);
      setRoutes(routeRes);
      setSchedules(schRes);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setMessage("❌ Failed to load data.");
      setMessageType("error");
    }
  };

  /**
   * Handles changes in form input fields.
   * @param e The change event from the input element.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handles the form submission for adding a new schedule.
   * @param e The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bus_id || !form.route_id || !form.departure_time || !form.arrival_time || !form.price) {
      setMessageType('error');
      setMessage('Please fill in all required fields.');
      return;
    }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setMessageType('error');
      setMessage('Price must be a positive number.');
      return;
    }
    if (form.departure_time >= form.arrival_time) {
      setMessageType('error');
      setMessage('Arrival time must be after departure time.');
      return;
    }
    setMessageType(null);
    setMessage(null); // Clear previous messages

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/schedules/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: { status: string; message?: string } = await res.json();

      if (data.status === "success") {
        setMessage("✅ Schedule added successfully!");
        setMessageType("success");
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        fetchData(); // Refresh data after successful addition
        setForm({ bus_id: '', route_id: '', departure_time: '', arrival_time: '', price: '' }); // Reset form
      } else {
        setMessage(data.message || "❌ Something went wrong.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Failed to add schedule:", error);
      setMessage("❌ Failed to add schedule due to network error.");
      setMessageType("error");
    }
  };

  /**
   * Opens the confirmation modal for deleting a schedule.
   * @param id The ID of the schedule to be deleted.
   */
  const handleDeleteClick = (id: string) => {
    setScheduleToDeleteId(id);
    setShowConfirmModal(true);
  };

  /**
   * Confirms and proceeds with the deletion of a schedule.
   */
  const confirmDelete = async () => {
    if (!scheduleToDeleteId) return;

    setShowConfirmModal(false); // Close the modal
    setMessage(null); // Clear previous messages

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/schedules/delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule_id: scheduleToDeleteId })
      });

      const data: { status: string; message?: string } = await res.json();

      if (data.status === "success") {
        setMessage("✅ Schedule deleted successfully!");
        setMessageType("success");
        fetchData(); // Refresh data after successful deletion
      } else {
        setMessage(data.message || "❌ Failed to delete schedule.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      setMessage("❌ Failed to delete schedule due to network error.");
      setMessageType("error");
    } finally {
      setScheduleToDeleteId(null); // Clear the ID
    }
  };

  /**
   * Cancels the deletion and closes the confirmation modal.
   */
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setScheduleToDeleteId(null);
  };

  return (
    <AdminSidebar>
      <div className="container mt-5">
        <h2 className="text-2xl font-bold mb-4">Manage Bus Schedules</h2>

        {/* Message display for success/error */}
        {message && (
          <div className={`p-3 mb-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
            {message}
            
          </div>
        )}

        {/* Schedule Add Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
          {/* Bus Selection */}
          <select
            name="bus_id"
            value={form.bus_id}
            onChange={handleChange}
            className="form-select col-span-full md:col-span-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
           
          >
            <option value="">Select Bus</option>
            {buses.map((b: Bus) => {
              // Find the schedule for the current bus, if any
             // const scheduleForBus = schedules.find((s: Schedule) => s.bus_id === b.bus_id);
              return (
                <option key={b.bus_id} value={b.bus_id}>
                  {b.bus_number}  {b.bus_type}
                
                </option>
              );
            })}
          </select>

          {/* Route Selection */}
          <select
            name="route_id"
            value={form.route_id}
            onChange={handleChange}
            className="form-select col-span-full md:col-span-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          
          >
            <option value="">Select Route</option>
            {routes.map((r: Route) => (
              <option key={r.route_id} value={r.route_id}>
                {r.start_location} → {r.end_location}
              </option>
            ))}
          </select>

          {/* Departure Time Input */}
          <input
            type="datetime-local"
            name="departure_time"
            value={form.departure_time}
            onChange={handleChange}
            className="form-control col-span-full md:col-span-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            
          />

          {/* Arrival Time Input */}
          <input
            type="datetime-local"
            name="arrival_time"
            value={form.arrival_time}
            min={form.departure_time || new Date().toISOString().slice(0, 16)} // Ensure arrival is not before departure or current time
            onChange={handleChange}
            className="form-control col-span-full md:col-span-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            
          />

          {/* Price Input */}
          <input
            type="number"
            name="price"
            placeholder="Price (Ks)"
            value={(form.price).split('.')[0]} // Ensure price is a valid number
            onChange={handleChange}
            min={1000} // Minimum price
            className="form-control col-span-full md:col-span-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        
          />

          {/* Add Schedule Button */}
          <button
            type="submit"
            className="btn btn-primary col-span-full md:col-span-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Add Schedule
          </button>
        </form>

        {/* Schedules Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 border-b border-gray-200">ID</th>
                <th className="py-3 px-6 border-b border-gray-200">Bus</th>
                <th className="py-3 px-6 border-b border-gray-200">Route</th>
                <th className="py-3 px-6 border-b border-gray-200">Departure</th>
                <th className="py-3 px-6 border-b border-gray-200">Arrival</th>
                <th className="py-3 px-6 border-b border-gray-200">Price</th>
                <th className="py-3 px-6 border-b border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 px-6 text-center">No schedules found.</td>
                </tr>
              ) : (
                schedules.map((s: Schedule, index: number) => (
                  <tr key={s.schedule_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 whitespace-nowrap">{index + 1}</td>
                    <td className="py-3 px-6">{s.bus_number}</td>
                    <td className="py-3 px-6">{s.start_location} → {s.end_location}</td>
                    <td className="py-3 px-6">{new Date(s.departure_time).toLocaleString()}</td>
                    <td className="py-3 px-6">{new Date(s.arrival_time).toLocaleString()}</td>
                    <td className="py-3 px-6">{s.price} Ks</td>
                    <td className="py-3 px-6">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs transition duration-300 ease-in-out"
                        onClick={() => handleDeleteClick(s.schedule_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this schedule? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}
