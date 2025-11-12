import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let serviceAccount;

// Debug: Log which environment variables are available (without exposing secrets)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔍 Firebase Config Check:');
  console.log('   FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
  console.log('   FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing');
  console.log('   FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Missing');
}

// Use environment variables (recommended for production)
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
  // Fallback: Try to read from file path (for local development only)
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
      join(__dirname, '../../../prasf-3c29f-firebase-adminsdk-fbsvc-5c2df7d7bf.json');
    const serviceAccountData = readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountData);
    console.log('⚠️  Using Firebase service account from file (local development only)');
  } catch (error) {
    console.error('\n❌ Firebase configuration missing!');
    console.error('\n📋 Required Environment Variables:');
    console.error('   1. FIREBASE_PRIVATE_KEY (most important)');
    console.error('   2. FIREBASE_PROJECT_ID');
    console.error('   3. FIREBASE_CLIENT_EMAIL');
    console.error('\n🔧 How to fix:');
    console.error('   1. Go to Render Dashboard → Your Service → Environment');
    console.error('   2. Add each variable with the exact name above');
    console.error('   3. For FIREBASE_PRIVATE_KEY, copy the entire key from your JSON file');
    console.error('   4. Make sure FIREBASE_PRIVATE_KEY includes \\n (backslash-n) characters');
    console.error('   5. Save and redeploy');
    console.error('\n💡 Tip: Run "node extract-firebase-env.js" locally to get formatted values\n');
    throw new Error('Firebase configuration missing. Set environment variables in Render dashboard.');
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

