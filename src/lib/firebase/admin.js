import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (singleton)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Replace escaped newlines in the private key
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

/**
 * Verify a Firebase ID token from the Authorization header.
 * Returns the decoded token (with uid, email, etc.) or null.
 */
export async function verifyFirebaseToken(authorizationHeader) {
  if (!authorizationHeader?.startsWith('Bearer ')) return null;
  const token = authorizationHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

export default admin;
