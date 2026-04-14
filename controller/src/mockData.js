export const buses = [
  {
    id: 'B001',
    routeNumber: 'R-101',
    from: 'Sector 15',
    to: 'City University',
    totalStudents: 42,
    online: true,
    driverId: 'D01',
    status: 'Moving',
    speed: '45 km/h',
    fuel: '78%',
    stops: [
      { name: 'Sector 15 Main Gate', students: 12, time: '08:00 AM' },
      { name: 'Central Park', students: 8, time: '08:15 AM' },
      { name: 'Library Square', students: 15, time: '08:30 AM' },
      { name: 'University Gate', students: 7, time: '08:45 AM' }
    ],
    attendance: {
      morning: { in: '08:02 AM', out: '08:48 AM', count: 42 },
      evening: { in: '04:15 PM', out: '05:05 PM', count: 40 }
    },
    tripsPerDay: 4,
    routeHistory: {
      '2026-04-12': [
        [21.1458, 79.0882],
        [21.1500, 79.0900],
        [21.1550, 79.0950],
        [21.1600, 79.1000],
        [21.1650, 79.1050],
        [21.1700, 79.1100]
      ],
      '2026-04-13': [
        [21.1458, 79.0882],
        [21.1400, 79.0850],
        [21.1350, 79.0800],
        [21.1300, 79.0750],
        [21.1250, 79.0700]
      ]
    }
  },
  {
    id: 'B002',
    routeNumber: 'R-105',
    from: 'Green Valley',
    to: 'City University',
    totalStudents: 35,
    online: true,
    driverId: 'D02',
    status: 'Stopped',
    speed: '0 km/h',
    fuel: '62%',
    stops: [
      { name: 'Green Valley', students: 20, time: '07:45 AM' },
      { name: 'Riverside', students: 15, time: '08:10 AM' }
    ],
    attendance: {
      morning: { in: '07:48 AM', out: '08:55 AM', count: 35 },
      evening: { in: '04:00 PM', out: '04:55 PM', count: 35 }
    },
    tripsPerDay: 2,
    routeHistory: {
      '2026-04-13': [
        [21.1458, 79.0882],
        [21.1500, 79.0800],
        [21.1550, 79.0700],
        [21.1600, 79.0600]
      ]
    }
  },
  {
    id: 'B003',
    routeNumber: 'R-112',
    from: 'Old Town',
    to: 'Primary School East',
    totalStudents: 28,
    online: false,
    driverId: 'D03',
    status: 'Maintenance',
    speed: '0 km/h',
    fuel: '15%',
    stops: [
      { name: 'Old Town Square', students: 10, time: '07:30 AM' },
      { name: 'Market Street', students: 18, time: '07:50 AM' }
    ],
    attendance: {
      morning: { in: '07:35 AM', out: '08:15 AM', count: 28 },
      evening: { in: '03:30 PM', out: '04:15 PM', count: 28 }
    },
    tripsPerDay: 2,
    routeHistory: {
      '2026-04-13': [
        [21.1458, 79.0882],
        [21.1400, 79.0900],
        [21.1350, 79.1000]
      ]
    }
  }
];

export const drivers = [
  { id: 'D01', name: 'John Doe', phone: '+1 234 567 890', rating: 4.8, experience: '5 years', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  { id: 'D02', name: 'Michael Smith', phone: '+1 345 678 901', rating: 4.5, experience: '3 years', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: 'D03', name: 'Sarah Wilson', phone: '+1 456 789 012', rating: 4.9, experience: '7 years', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
];

export const stats = {
  totalBuses: 12,
  onlineBuses: 8,
  totalStudents: 450
};
