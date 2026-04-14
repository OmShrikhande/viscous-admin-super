import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, MapPin, User, Save, X } from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import '../styles/AddBus.css';

const AddBus = () => {
  const navigate = useNavigate();
  const { drivers, addBus } = useFleet();
  const [formData, setFormData] = useState({
    busId: '',
    routeNumber: '',
    from: '',
    to: '',
    driverId: '',
    totalStudents: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addBus({
      ...formData,
      totalStudents: parseInt(formData.totalStudents) || 0,
    });
    alert(`Bus ${formData.busId} has been registered and added to the live map!`);
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="add-bus-page">
      <header className="page-header">
        <h1>Register New Bus</h1>
        <p>Add a new vehicle and assign a driver to the fleet.</p>
      </header>

      <form className="glass-card add-bus-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label><Bus size={16} /> Bus ID / Number Plate</label>
            <input 
              type="text" 
              name="busId" 
              placeholder="e.g. B-9012" 
              value={formData.busId}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label><MapPin size={16} /> Route Number</label>
            <input 
              type="text" 
              name="routeNumber" 
              placeholder="e.g. R-405" 
              value={formData.routeNumber}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Route Origin (From)</label>
            <input 
              type="text" 
              name="from" 
              placeholder="Origin location" 
              value={formData.from}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Route Destination (To)</label>
            <input 
              type="text" 
              name="to" 
              placeholder="Destination location" 
              value={formData.to}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group full-width">
            <label><User size={16} /> Assign Driver</label>
            <select 
              name="driverId" 
              value={formData.driverId}
              onChange={handleChange}
              required
            >
              <option value="">Select a registered driver</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.experience} exp)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Total Student Capacity</label>
            <input 
              type="number" 
              name="totalStudents" 
              placeholder="e.g. 50" 
              value={formData.totalStudents}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
            <X size={18} /> Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Save size={18} /> Register Bus
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBus;
