# 🔥 Firebase Environment Variables for Render

## Quick Setup Guide

Your Render deployment is failing because Firebase environment variables are missing. Follow these steps:

### Step 1: Get Your Firebase Credentials

You need to extract values from your Firebase JSON file: `prasf-3c29f-firebase-adminsdk-fbsvc-5c2df7d7bf.json`

**Option A: Use the helper script (if file is local)**
```bash
cd backend
node extract-firebase-env.js
```

**Option B: Manually extract from JSON file**

Open your Firebase JSON file and copy these values:

### Step 2: Add Environment Variables in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your **Smart-Study-Assistant** service
3. Click on **Environment** tab
4. Click **Add Environment Variable**

### Step 3: Add These Variables

Add each variable one by one:

#### 1. FIREBASE_PROJECT_ID
```
prasf-3c29f
```

#### 2. FIREBASE_CLIENT_EMAIL
```
firebase-adminsdk-fbsvc@prasf-3c29f.iam.gserviceaccount.com
```

#### 3. FIREBASE_PRIVATE_KEY ⚠️ IMPORTANT
Copy the entire `private_key` value from your JSON file. It should look like:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

**Important:** 
- Keep the `\n` characters as-is (don't replace them with actual newlines)
- Copy the ENTIRE key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- No extra spaces or quotes

#### 4. FIREBASE_PRIVATE_KEY_ID (Optional but recommended)
Copy from `private_key_id` field in your JSON file

#### 5. FIREBASE_CLIENT_ID (Optional but recommended)
Copy from `client_id` field in your JSON file

### Step 4: Save and Redeploy

1. Click **Save Changes**
2. Render will automatically redeploy
3. Check the logs - you should see: `✅ Firebase Admin initialized`

## 🔍 How to Find Your JSON File

If you have the file locally:
- Check: `backend/prasf-3c29f-firebase-adminsdk-fbsvc-5c2df7d7bf.json`
- Or in the root directory

If you don't have the file:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `prasf-3c29f`
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Extract the values as described above

## ✅ Verification

After adding variables and redeploying, check Render logs:

**Success:**
```
✅ Firebase Admin initialized
```

**Error:**
If you still see errors, double-check:
- All variables are set (especially FIREBASE_PRIVATE_KEY)
- No extra quotes around values
- FIREBASE_PRIVATE_KEY includes the full key with `\n` characters
- Variable names are exactly as shown (case-sensitive)

## 🆘 Troubleshooting

**Error: "Firebase configuration missing"**
- Make sure all 3 required variables are set
- Check for typos in variable names
- Verify FIREBASE_PRIVATE_KEY is the complete key

**Error: "Invalid credentials"**
- Regenerate the Firebase service account key
- Make sure FIREBASE_PRIVATE_KEY has `\n` not actual newlines
- Verify FIREBASE_CLIENT_EMAIL matches the JSON file

**Still having issues?**
- Check Render logs for specific error messages
- Verify your Firebase project is active
- Make sure Firestore API is enabled in Google Cloud Console

