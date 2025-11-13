import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseInitialized = false;
let adminAuth = null;
let adminDb = null;

// Initialize Firebase Admin (optional - won't block server startup)
function initializeFirebase() {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      firebaseInitialized = true;
      adminAuth = admin.auth();
      adminDb = admin.firestore();
      return true;
    }

    // Use environment variables (recommended for production)
    if (process.env.FIREBASE_PRIVATE_KEY) {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID || "prasf-3c29f",
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@prasf-3c29f.iam.gserviceaccount.com",
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@prasf-3c29f.iam.gserviceaccount.com")}`
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      firebaseInitialized = true;
      adminAuth = admin.auth();
      adminDb = admin.firestore();
      console.log('✅ Firebase Admin initialized');
      return true;
    } else {
      console.log('⚠️  Firebase not configured - Firebase features will be disabled');
      console.log('   To enable Firebase, set these environment variables:');
      console.log('   - FIREBASE_PRIVATE_KEY');
      console.log('   - FIREBASE_PROJECT_ID');
      console.log('   - FIREBASE_CLIENT_EMAIL');
      return false;
    }
  } catch (error) {
    console.error('⚠️  Firebase initialization failed:', error.message);
    console.log('   Server will continue without Firebase features');
    return false;
  }
}

// Initialize Firebase (non-blocking)
initializeFirebase();

// Export Firebase services (will be null if not initialized)
export { adminAuth, adminDb };
export const isFirebaseInitialized = () => firebaseInitialized;

export default admin;

