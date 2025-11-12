import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to Firebase service account key
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
  join(__dirname, '../../../prasf-3c29f-firebase-adminsdk-fbsvc-5c2df7d7bf.json');

let serviceAccount;

try {
  // Try to read from file path
  const serviceAccountData = readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountData);
} catch (error) {
  // If file not found, try to use environment variables
  if (process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
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
  } else {
    console.error('Firebase service account not found. Please configure FIREBASE_SERVICE_ACCOUNT_PATH or environment variables.');
    throw error;
  }
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialized');
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

export default admin;

