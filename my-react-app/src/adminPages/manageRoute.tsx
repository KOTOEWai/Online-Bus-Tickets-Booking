/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AdminSidebar from '../components/adminNav';
import { motion, AnimatePresence} from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { messageVariants } from '../hooks/useAnimationVariants';
export default function ManageRoutes() {
  const [routes, setRoutes] = useState([]);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);
  const [form, setForm] = useState({
    start_location: '',
    end_location: '',
    distance_km: '',
  });

  const fetchRoutes = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/routes/read.php`);
    const data = await res.json();
    setRoutes(data);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.start_location || !form.end_location || !form.distance_km) {
      setMessageType('error');
      setMessage('Please fill in all required fields.');
      return;
    }
    if (isNaN(Number(form.distance_km)) || Number(form.distance_km) <= 0) {
      setMessageType('error');
      setMessage('Distance must be a positive number.');
      return;
    }
  
    if (form.start_location.trim() === '' || form.end_location.trim() === '') {
      setMessageType('error');
      setMessage('Start and end locations cannot be empty.');
      return;
    }
    setMessageType(null);
    setMessage(null);

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/routes/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    if (result.status === 'success') {
      setMessageType('success');
      setMessage('Route added successfully!');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      setForm({ start_location: '', end_location: '', distance_km: '' });
      fetchRoutes();
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (route_id: number) => {
    if (!window.confirm('Are you sure to delete this route?')) return;

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/routes/delete.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ route_id }),
    });

    const result = await res.json();
    if (result.status === 'success') {
      fetchRoutes();
    } else {
      alert(result.message);
    }
  };

  return (
     <AdminSidebar>
    <div className="container mt-5">
      <h2 className="mb-4">Manage Bus Routes</h2>
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

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <input type="text" className="form-control"  name="start_location" value={form.start_location} onChange={handleChange} placeholder="Start Location" />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="end_location" value={form.end_location} onChange={handleChange} placeholder="End Location" />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" min={30} name="distance_km" value={form.distance_km} onChange={handleChange} placeholder="Distance (km)"  />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Add Route</button>
        </div>
      </form>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Start</th>
            <th>End</th>
            <th>Distance (km)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route: any,index) => (
              <tr key={route.route_id}>
               <td>{index + 1}</td>
              <td>{route.start_location}</td>
              <td>{route.end_location}</td>
              <td>{route.distance_km}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(route.route_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminSidebar>
  );
}
