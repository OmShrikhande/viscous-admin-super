import React, { createContext, useContext, useState, useEffect } from 'react';
import { buses as initialBuses, drivers as initialDrivers } from '../mockData';

const FleetContext = createContext();

export const FleetProvider = ({ children }) => {
  // Load initial state from localStorage or mockData
  const [buses, setBuses] = useState(() => {
    const saved = localStorage.getItem('fleet_buses');
    return saved ? JSON.parse(saved) : initialBuses;
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('fleet_drivers');
    return saved ? JSON.parse(saved) : initialDrivers;
  });

  // Real-time bus coordinates for Leaflet
  const [busLocations, setBusLocations] = useState(() => {
    return initialBuses.reduce((acc, bus) => {
      // Initialize with coordinates around Nagpur if not present
      acc[bus.id] = { 
        lat: 21.1458 + (Math.random() - 0.5) * 0.02, 
        lng: 79.0882 + (Math.random() - 0.5) * 0.02 
      };
      return acc;
    }, {});
  });

  // Persistence logic
  useEffect(() => {
    localStorage.setItem('fleet_buses', JSON.stringify(buses));
    localStorage.setItem('fleet_drivers', JSON.stringify(drivers));
  }, [buses, drivers]);

  // Simulation Engine: Move online buses slightly every 4 seconds
  useEffect(() => {
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

  const addDriver = (driver) => {
    const newDriver = {
      ...driver,
      id: `D${drivers.length + 1}`,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name}`
    };
    setDrivers([...drivers, newDriver]);
  };

  const addBus = (bus) => {
    const newBus = {
      ...bus,
      id: `B${String(buses.length + 1).padStart(3, '0')}`,
      online: true,
      status: 'Moving',
      speed: '0 km/h',
      fuel: '100%',
      stops: [],
      attendance: { morning: { in: '--', out: '--', count: 0 }, evening: { in: '--', out: '--', count: 0 } },
      tripsPerDay: 0
    };
    setBuses([...buses, newBus]);
    // Initialize location for the new bus
    setBusLocations(prev => ({
      ...prev,
      [newBus.id]: { lat: 21.1458, lng: 79.0882 }
    }));
  };

  return (
    <FleetContext.Provider value={{ buses, drivers, busLocations, addDriver, addBus }}>
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => useContext(FleetContext);
