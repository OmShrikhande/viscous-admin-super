const { auth, db } = require('../config/firebase');

const seedControllerData = async () => {
  const collegeName = 'S.B. Jain Institute of Technology Management & Research';
  const controllerEmail = 'cotroller@sbjain.com';
  const controllerPassword = 'controller123';

  console.log(`[Seed-Controller] Starting seed for ${collegeName}...`);

  try {
    // 1. Create College Document
    const collegeSnap = await db.collection('colleges').where('name', '==', collegeName).get();
    let collegeId;

    if (collegeSnap.empty) {
      const collegeRef = await db.collection('colleges').add({
        name: collegeName,
        code: 'SBJAIN',
        city: 'Nagpur',
        state: 'Maharashtra',
        contactEmail: 'info@sbjain.edu.in',
        contactPhone: '+91 712 266 7777',
        plan: 'Premium',
        planExpiryDate: '2027-01-01T00:00:00Z',
        status: 'active',
        createdAt: new Date().toISOString()
      });
      collegeId = collegeRef.id;
      console.log(`[Seed-Controller] College '${collegeName}' created.`);
    } else {
      collegeId = collegeSnap.docs[0].id;
      console.log(`[Seed-Controller] College '${collegeName}' already exists.`);
    }

    // 2. Create Controller Admin in Auth and Firestore
    let controllerUid;
    try {
      const userRes = await auth.getUserByEmail(controllerEmail);
      controllerUid = userRes.uid;
      console.log(`[Seed-Controller] Controller user ${controllerEmail} already exists in Auth.`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        const userRes = await auth.createUser({
          email: controllerEmail,
          password: controllerPassword,
          displayName: 'College Controller',
        });
        controllerUid = userRes.uid;
        await auth.setCustomUserClaims(controllerUid, { role: 'controller' });
        console.log(`[Seed-Controller] Controller user ${controllerEmail} created in Auth.`);
      } else {
        throw error;
      }
    }

    const adminDocRef = db.collection('admins').doc(controllerUid);
    const adminDoc = await adminDocRef.get();
    if (!adminDoc.exists) {
      await adminDocRef.set({
        name: 'College Controller',
        email: controllerEmail,
        role: 'controller',
        college: collegeName,
        status: 'active',
        permissions: ['all'],
        createdAt: new Date().toISOString()
      });
      console.log(`[Seed-Controller] Controller document created in 'admins' collection.`);
    }

    // 3. Seed Buses
    const buses = [
      { 
        routeNumber: 'R-101', from: 'Trimurti Nagar', to: 'College Campus', status: 'Moving', online: true, speed: '42 km/h', fuel: '85%', totalStudents: 42, college: collegeName,
        stops: [
          { name: 'Trimurti Nagar Sq', time: '07:30 AM', students: 12 },
          { name: 'Pratap Nagar', time: '07:45 AM', students: 15 },
          { name: 'Mate Sq', time: '08:00 AM', students: 15 }
        ],
        attendance: {
          morning: { in: '07:30 AM', out: '08:45 AM', count: 42 },
          evening: { in: '04:30 PM', out: '05:45 PM', count: 42 }
        },
        tripsPerDay: 4,
        routeHistory: {
          '2026-04-14': [
            [21.1215, 79.0487], [21.1350, 79.0600], [21.1458, 79.0882]
          ]
        }
      },
      { 
        routeNumber: 'R-102', from: 'Manish Nagar', to: 'College Campus', status: 'Moving', online: true, speed: '38 km/h', fuel: '70%', totalStudents: 35, college: collegeName,
        stops: [
          { name: 'Manish Nagar', time: '07:15 AM', students: 20 },
          { name: 'Chatrapati Sq', time: '07:40 AM', students: 15 }
        ],
        attendance: {
          morning: { in: '07:15 AM', out: '08:50 AM', count: 35 },
          evening: { in: '04:40 PM', out: '05:50 PM', count: 35 }
        },
        tripsPerDay: 4
      },
      { 
        routeNumber: 'R-103', from: 'Civil Lines', to: 'College Campus', status: 'Stopped', online: true, speed: '0 km/h', fuel: '92%', totalStudents: 48, college: collegeName,
        stops: [{ name: 'Civil Lines', time: '08:00 AM', students: 48 }],
        attendance: {
          morning: { in: '08:00 AM', out: '09:00 AM', count: 48 },
          evening: { in: '05:00 PM', out: '06:00 PM', count: 48 }
        },
        tripsPerDay: 2
      },
      { routeNumber: 'R-104', from: 'Sadar', to: 'College Campus', status: 'Maintenance', online: false, speed: '0 km/h', fuel: '40%', totalStudents: 0, college: collegeName, stops: [], attendance: { morning: { in: '--', out: '--', count: 0 }, evening: { in: '--', out: '--', count: 0 } }, tripsPerDay: 0 },
    ];

    for (const bus of buses) {
      const busSnap = await db.collection('buses')
        .where('routeNumber', '==', bus.routeNumber)
        .where('college', '==', collegeName)
        .get();
      
      if (busSnap.empty) {
        await db.collection('buses').add({
          ...bus,
          lastMaintenance: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });
      }
    }
    console.log(`[Seed-Controller] Buses seeded for ${collegeName}.`);

    // 4. Seed Drivers
    const drivers = [
      { name: 'John Doe', phone: '+91 98765 43210', license: 'MH31A2024001', status: 'active', college: collegeName },
      { name: 'Sameer Khan', phone: '+91 87654 32109', license: 'MH31A2024002', status: 'active', college: collegeName },
      { name: 'Rajesh Gupta', phone: '+91 76543 21098', license: 'MH31A2024003', status: 'active', college: collegeName },
      { name: 'Amit Singh', phone: '+91 65432 10987', license: 'MH31A2024004', status: 'inactive', college: collegeName },
    ];

    for (const driver of drivers) {
      const driverSnap = await db.collection('drivers')
        .where('name', '==', driver.name)
        .where('college', '==', collegeName)
        .get();
      
      if (driverSnap.empty) {
        await db.collection('drivers').add({
          ...driver,
          createdAt: new Date().toISOString()
        });
      }
    }
    console.log(`[Seed-Controller] Drivers seeded for ${collegeName}.`);

    // 5. Seed Users (Students/Parents)
    const users = [
      { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'student', route: 'R-101', status: 'active', college: collegeName },
      { name: 'Priya Patil', email: 'priya@example.com', role: 'student', route: 'R-105', status: 'active', college: collegeName },
      { name: 'Sneha Gupta', email: 'sneha@example.com', role: 'parent', route: 'R-101', status: 'active', college: collegeName },
      { name: 'Amit Deshmukh', email: 'amit@example.com', role: 'student', route: 'R-102', status: 'active', college: collegeName },
    ];

    for (const user of users) {
      const userSnap = await db.collection('users')
        .where('email', '==', user.email)
        .where('college', '==', collegeName)
        .get();
      
      if (userSnap.empty) {
        await db.collection('users').add({
          ...user,
          createdAt: new Date().toISOString()
        });
      }
    }
    console.log(`[Seed-Controller] Users (Students/Parents) seeded for ${collegeName}.`);

    console.log(`[Seed-Controller] Seed check completed for ${collegeName}.`);
  } catch (error) {
    console.error(`[Seed-Controller] Error seeding controller data:`, error);
  }
};

module.exports = seedControllerData;
