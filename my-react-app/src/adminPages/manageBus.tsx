/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AdminSidebar from '../components/adminNav';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { messageVariants } from '../hooks/useAnimationVariants';
import { motion, AnimatePresence} from 'framer-motion';
export default function ManageBus() {
  const [buses, setBuses] = useState([]);
    const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);
  const [form, setForm] = useState({
    bus_number: '',
    bus_type: '',
    total_seats: '',
    opertor_name: '',
    description: '',
    bus_image:''
  });

 const [message, setMessage] = useState<string | null>(null);

const [image,setImage] = useState<File|null>(null)
  const fetchBuses = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/bus/read.php`);
    const data = await res.json();
    setBuses(data);
  };
  useEffect(() => {
    fetchBuses();
  }, []);
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: any) => {
  e.preventDefault();
  if (!image) {
      setMessageType('error');
      setMessage('Please select an image to upload.');
      return;
    }
  setMessageType(null);
  setMessage(null);
  if (!form.bus_number || !form.bus_type || !form.total_seats || !form.opertor_name) {
      setMessageType('error');
      setMessage('Please fill in all required fields.');
      return;
    }
  if (isNaN(Number(form.total_seats)) || Number(form.total_seats) <= 0) {
      setMessageType('error');
      setMessage('Total seats must be a positive number.');
      return;
    }
  if (form.bus_number.trim() === '' || form.bus_type.trim() === '' || form.opertor_name.trim() === '') {
      setMessageType('error');
      setMessage('Bus number, type, and operator name cannot be empty.');
      return;
    }
   setMessage('Uploading bus details...');


  const formData = new FormData();
  formData.append('bus_number', form.bus_number);
  formData.append('bus_type', form.bus_type);
  formData.append('total_seats', form.total_seats);
  formData.append('opertor_name', form.opertor_name);
  formData.append('description', form.description);
  if (image) formData.append('bus_image', image);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/bus/create.php`, {
      method: 'POST',
      body: formData,
    });

    const text = await res.text(); // read raw text
    const result = JSON.parse(text); // try to parse

    if (result.status === 'success') {
       setMessageType('success');
       setTimeout(() => {

      setMessage('Bus added successfully!');
       },9000)
      fetchBuses();
      setForm({ bus_number: '', bus_type: '', total_seats: '', opertor_name: '', description: '', bus_image: '' });
      setImage(null);
    } else {
      setMessage(result.message || "Upload failed");
    }

  } catch (err) {
    console.error("Error parsing JSON or uploading:", err);
    alert("Something went wrong. Please check server.");
  }
};



  return (
    <AdminSidebar>
 
    <div className="col-md-10  p-4">
      <h3 className="text-primary mb-4">🚌 Manage Buses</h3>

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

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="row g-3 mb-5">
        <div className="col-md-6">
  <input
    type="file"
    className="form-control"
    accept="image/*"
    onChange={(e) => setImage(e.target.files?.[0] || null)}
   
  />
</div>

        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Bus Number"
            name="bus_number"
            value={form.bus_number}
            onChange={handleChange}
          
          />
        </div>
        
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Bus Type"
            name="bus_type"
            value={form.bus_type}
            onChange={handleChange}
        
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            type="number"
            placeholder="Total Seats"
            name="total_seats"
            value={form.total_seats}
            onChange={handleChange}
         
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Operator Name"
            name="opertor_name"
            value={form.opertor_name}
            onChange={handleChange}
          
          />
        </div>
        <div className="col-12">
          <textarea
            className="form-control"
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary">
            ➕ Add Bus
          </button>
        </div>
      </form>

      {/* Table Section */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Bus Number</th>
              <th>Type</th>
              <th>Total Seats</th>
              <th>Operator</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus: any, index: number) => (
              <tr key={bus.bus_id}>
                <td>{index + 1}</td>
                <td>
  {bus.image && (
    <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${bus.image}`} alt="Bus" width="100" />
  )}
</td>

                <td>{bus.bus_number}</td>
                <td>{bus.bus_type}</td>
                <td>{bus.total_seats}</td>
                <td>{bus.opertor_name}</td>
                <td>{bus.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   
    </AdminSidebar>
  );
}
