const { auth, db } = require('../config/firebase');

const seedDatabase = async () => {
  const superAdminEmail = 'viscous@admin.com';
  const superAdminPassword = 'admin123';

  try {
    // 1. Create or verify the Super Admin in Firebase Authentication
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(superAdminEmail);
      console.log(`[Seed] Super Admin user (${superAdminEmail}) already exists in Firebase Auth.`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email: superAdminEmail,
          password: superAdminPassword,
          displayName: 'Super Admin',
          emailVerified: true,
        });
        console.log(`[Seed] Super Admin user created in Firebase Auth with ID: ${userRecord.uid}`);
        
        // Add custom claims for role-based access
        await auth.setCustomUserClaims(userRecord.uid, { role: 'super_admin' });
      } else {
        throw error;
      }
    }

    // 2. Ensure Super Admin document exists in Firestore 'admins' collection
    if (userRecord && userRecord.uid) {
      const adminDocRef = db.collection('admins').doc(userRecord.uid);
      const adminDoc = await adminDocRef.get();
      
      if (!adminDoc.exists) {
        await adminDocRef.set({
          email: superAdminEmail,
          name: 'Super Admin',
          role: 'super_admin',
          status: 'active',
          permissions: ['all'],
          createdAt: new Date().toISOString()
        });
        console.log(`[Seed] Super Admin document created in Firestore 'admins' collection.`);
      }
    }

    // 3. Ensure other collections exist by creating a default settings document
    // Firestore collections are auto-created when a document is added to them.
    const settingsRef = db.collection('settings').doc('general');
    const settingsDoc = await settingsRef.get();
    if (!settingsDoc.exists) {
      await settingsRef.set({
        maintenanceMode: false,
        systemName: 'Viscous Super Admin',
        supportEmail: 'support@viscous.com',
        createdAt: new Date().toISOString()
      });
      console.log(`[Seed] Default 'settings' document created.`);
    }

    console.log('[Seed] Database seed check completed successfully.');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};

module.exports = seedDatabase;
