#!/usr/bin/env node

/**
 * Helper script to extract Firebase credentials from JSON file
 * and format them for Render environment variables
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to Firebase service account key (check multiple locations)
const possiblePaths = [
  join(__dirname, 'prasf-3c29f-firebase-adminsdk-fbsvc-5c2df7d7bf.json'), // Same directory
  join(__dirname, '../prasf-3c29f-firebase-adminsdk-fbsvc-5c2df7d7bf.json'), // Parent directory
  join(__dirname, '../../prasf-3c29f-firebase-adminsdk-fbsvc-5c2df7d7bf.json'), // Root
  'prasf-3c29f-firebase-adminsdk-fbsvc-5c2df7d7bf.json',
];

let firebaseJsonPath = null;
for (const path of possiblePaths) {
  try {
    readFileSync(path, 'utf8');
    firebaseJsonPath = path;
    break;
  } catch (e) {
    continue;
  }
}

if (!firebaseJsonPath) {
  console.error('❌ Firebase JSON file not found. Checked locations:');
  possiblePaths.forEach(p => console.error(`   - ${p}`));
  console.error('\n   Make sure the file exists in one of these locations.\n');
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(readFileSync(firebaseJsonPath, 'utf8'));
  
  console.log('\n🔥 Firebase Environment Variables for Render\n');
  console.log('=' .repeat(60));
  console.log('\nCopy and paste these into your Render dashboard:\n');
  
  console.log('FIREBASE_PROJECT_ID');
  console.log(serviceAccount.project_id);
  console.log('');
  
  console.log('FIREBASE_CLIENT_EMAIL');
  console.log(serviceAccount.client_email);
  console.log('');
  
  console.log('FIREBASE_PRIVATE_KEY');
  // For Render, we need to escape newlines as \n (literal backslash-n)
  // Replace actual newlines with \n string
  const privateKeyForRender = serviceAccount.private_key.replace(/\n/g, '\\n');
  console.log(privateKeyForRender);
  console.log('');
  console.log('⚠️  IMPORTANT: The private key above has \\n (backslash-n) which Render will convert to newlines.');
  console.log('   Make sure to copy the ENTIRE key including -----BEGIN and -----END lines.');
  console.log('');
  
  if (serviceAccount.private_key_id) {
    console.log('FIREBASE_PRIVATE_KEY_ID');
    console.log(serviceAccount.private_key_id);
    console.log('');
  }
  
  if (serviceAccount.client_id) {
    console.log('FIREBASE_CLIENT_ID');
    console.log(serviceAccount.client_id);
    console.log('');
  }
  
  console.log('=' .repeat(60));
  console.log('\n✅ Instructions:');
  console.log('1. Go to Render dashboard → Your service → Environment');
  console.log('2. Click "Add Environment Variable"');
  console.log('3. Copy each variable name and value above');
  console.log('4. For FIREBASE_PRIVATE_KEY, paste the entire key including \\n');
  console.log('5. Save and redeploy\n');
  
} catch (error) {
  console.error('❌ Error reading Firebase JSON file:');
  console.error(`   ${error.message}`);
  console.error(`\n   Make sure the file exists at: ${firebaseJsonPath}\n`);
  process.exit(1);
}

