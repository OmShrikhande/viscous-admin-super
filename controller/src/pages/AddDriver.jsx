import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, BookOpen, Award, Save, X, ShieldCheck } from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import '../styles/AddDriver.css';

const AddDriver = () => {
  const navigate = useNavigate();
  const { addDriver } = useFleet();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    experience: '',
    rating: 5.0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addDriver(formData);
    alert(`Driver ${formData.name} has been successfully registered!`);
    navigate('/add-bus'); // Navigate to add bus so they can assign the new driver
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="add-driver-page">
      <header className="page-header">
        <h1>Register New Driver</h1>
        <p>Onboard a professional driver to join the Nagpur Fleet.</p>
      </header>

      <form className="glass-card add-driver-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label><User size={16} /> Driver Full Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="e.g. Rajesh Kumar" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label><Phone size={16} /> Contact Number</label>
            <input 
              type="tel" 
              name="phone" 
              placeholder="+91 XXXXX XXXXX" 
              value={formData.phone}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label><BookOpen size={16} /> License Number</label>
            <input 
              type="text" 
              name="licenseNumber" 
              placeholder="MH-31-XXXXXXX" 
              value={formData.licenseNumber}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label><Award size={16} /> Years of Experience</label>
            <input 
              type="text" 
              name="experience" 
              placeholder="e.g. 5 years" 
              value={formData.experience}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label><ShieldCheck size={16} /> Safety Rating (initial)</label>
            <input 
              type="number" 
              step="0.1"
              max="5"
              min="0"
              name="rating" 
              value={formData.rating}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
            <X size={18} /> Discard
          </button>
          <button type="submit" className="btn-primary">
            <Save size={18} /> Complete Onboarding
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDriver;
