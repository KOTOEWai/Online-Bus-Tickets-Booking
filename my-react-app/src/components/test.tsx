import { useEffect, useState } from "react";
import type { Schedules } from "../interfaces/types";

export default function EnhancedList() {
  const [schedules, setSchedules] = useState<Schedules[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('http://localhost:8080/Yandanar_Express/backend/api/admin/schedules/read.php');
        const data = await res.json();
        if (Array.isArray(data)) {
          const now = new Date();
          setSchedules(
            data.filter(s => new Date(s.departure_time) > now)
          );
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Bus Schedules</h2>
      {schedules.length > 0 ? (
        <div className="space-y-4">
          {schedules.map((s) => (
            <div 
              key={s.schedule_id} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-600">
                    {s.start_location} <span className="text-gray-400 font-normal">→</span> {s.end_location}
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm">Bus Number: {s.bus_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-semibold text-lg">
                    {new Date(s.departure_time).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm">
                    at {new Date(s.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No upcoming schedules found.</p>
      )}
    </div>
  );
}