import React, { createContext, useContext, useState, useEffect } from 'react';
import { buses as initialBuses, drivers as initialDrivers } from '../mockData';

const FleetContext = createContext();

export const FleetProvider = ({ children }) => {
  // Load initial state from localStorage or mockData
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time bus coordinates for Leaflet
  const [busLocations, setBusLocations] = useState({});

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('viscous_token');
      if (!token) return;

      try {
        const [busesRes, driversRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/controller/buses', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/v1/controller/drivers', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const busesData = await busesRes.json();
        const driversData = await driversRes.json();

        if (busesData.success) {
          setBuses(busesData.data);
          // Initialize locations
          const locations = {};
          busesData.data.forEach(bus => {
            locations[bus.id] = { 
              lat: 21.1458 + (Math.random() - 0.5) * 0.02, 
              lng: 79.0882 + (Math.random() - 0.5) * 0.02 
            };
          });
          setBusLocations(locations);
        }

        if (driversData.success) setDrivers(driversData.data);
      } catch (error) {
        console.error('Error fetching fleet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Simulation Engine: Move online buses slightly every 4 seconds
  useEffect(() => {
    if (buses.length === 0) return;

    const interval = setInterval(() => {
      setBusLocations(prev => {
        const next = { ...prev };
        buses.forEach(bus => {
          if (bus.online && bus.status === 'Moving') {
            const current = next[bus.id] || { lat: 21.1458, lng: 79.0882 };
            next[bus.id] = {
              lat: current.lat + (Math.random() - 0.5) * 0.001,
              lng: current.lng + (Math.random() - 0.5) * 0.001
            };
          }
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [buses]);

  const addDriver = async (driver) => {
    const token = localStorage.getItem('viscous_token');
    try {
      const response = await fetch('http://localhost:5000/api/v1/controller/drivers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(driver)
      });
      const data = await response.json();
      if (data.success) {
        setDrivers(prev => [...prev, data.data]);
      }
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  const addBus = async (bus) => {
    const token = localStorage.getItem('viscous_token');
    try {
      const response = await fetch('http://localhost:5000/api/v1/controller/buses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(bus)
      });
      const data = await response.json();
      if (data.success) {
        const newBus = data.data;
        setBuses(prev => [...prev, newBus]);
        setBusLocations(prev => ({
          ...prev,
          [newBus.id]: { lat: 21.1458, lng: 79.0882 }
        }));
      }
    } catch (error) {
      console.error('Error adding bus:', error);
    }
  };

  return (
    <FleetContext.Provider value={{ buses, drivers, busLocations, addDriver, addBus }}>
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => useContext(FleetContext);
