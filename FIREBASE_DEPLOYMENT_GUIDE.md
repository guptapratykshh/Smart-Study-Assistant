# 🔥 Firebase Deployment Guide for Render/Vercel

This guide will help you configure Firebase to work correctly when deploying to Render, Vercel, or other cloud platforms.

## ⚠️ Important: Why This Matters

When deploying, you **cannot** use local JSON files. You must use **environment variables** for Firebase credentials.

---

## 📋 Step 1: Get Firebase Service Account Credentials

### Option A: Download Service Account JSON (Easier)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **prasf-3c29f**
3. Click the **⚙️ Settings** icon → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Click **Generate Key** (JSON file will download)

### Option B: Copy from Existing JSON File

If you already have the JSON file (`prasf-3c29f-firebase-adminsdk-fbsvc-5c2df7d7bf.json`), open it and copy these values:

```json
{
  "type": "service_account",
  "project_id": "prasf-3c29f",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@prasf-3c29f.iam.gserviceaccount.com",
  "client_id": "...",
  ...
}
```

---

## 📋 Step 2: Extract Environment Variables

From your JSON file, extract these values:

1. **FIREBASE_PROJECT_ID**: `"project_id"` value
2. **FIREBASE_PRIVATE_KEY**: `"private_key"` value (keep the `\n` characters!)
3. **FIREBASE_PRIVATE_KEY_ID**: `"private_key_id"` value
4. **FIREBASE_CLIENT_EMAIL**: `"client_email"` value
5. **FIREBASE_CLIENT_ID**: `"client_id"` value

### ⚠️ Important: Private Key Format

The `FIREBASE_PRIVATE_KEY` must include the newline characters (`\n`). When copying to Render, paste it exactly as shown:

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

**OR** if Render doesn't support `\n`, you can paste the entire key on one line (the code will convert it).

---

## 📋 Step 3: Add Environment Variables to Render

1. Go to your Render dashboard
2. Select your **Smart-Study-Assistant** service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add these **5 variables**:

### Required Firebase Variables:

```
FIREBASE_PROJECT_ID=prasf-3c29f
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FULL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_PRIVATE_KEY_ID=your_private_key_id_from_json
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@prasf-3c29f.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id_from_json
```

### Example (with actual values):

```
FIREBASE_PROJECT_ID=prasf-3c29f
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_PRIVATE_KEY_ID=a1b2c3d4e5f6g7h8i9j0
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@prasf-3c29f.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789012345678901
```

---

## 📋 Step 4: Enable Required Firebase Services

Make sure these are enabled in Firebase Console:

### 1. Authentication
- Go to **Authentication** → **Sign-in method**
- Enable **Email/Password**
- Save

### 2. Firestore Database
- Go to **Firestore Database**
- Click **Create Database** (if not created)
- Choose **Start in test mode** (for development)
- Select a location (e.g., `us-central1`)
- Click **Enable**

### 3. Firestore API (IMPORTANT!)
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Select project: **prasf-3c29f**
- Go to **APIs & Services** → **Library**
- Search for **"Cloud Firestore API"**
- Click **Enable**

---

## 📋 Step 5: Frontend Firebase Configuration

For your **frontend** (Vercel/Netlify), add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCKgwXJbg78zFA9sds9VMBV3ddtYmbxLQI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prasf-3c29f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prasf-3c29f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prasf-3c29f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=175171323885
NEXT_PUBLIC_FIREBASE_APP_ID=1:175171323885:web:90f6915635a443f16489e4
```

**Where to find these:**
- Firebase Console → Project Settings → General → Your apps → Web app config

---

## ✅ Step 6: Verify Configuration

After deploying, check your Render logs:

1. Go to Render dashboard → Your service → **Logs**
2. Look for: `✅ Firebase Admin initialized`
3. If you see errors, check:
   - All 5 Firebase environment variables are set
   - Private key includes `\n` characters
   - Firestore API is enabled in Google Cloud Console

---

## 🧪 Testing

### Test Signup:
```bash
POST https://your-render-url.onrender.com/api/firebase/create-user
Headers: { Authorization: "Bearer YOUR_FIREBASE_ID_TOKEN" }
```

### Test Login:
```bash
POST https://your-render-url.onrender.com/api/firebase/profile
Headers: { Authorization: "Bearer YOUR_FIREBASE_ID_TOKEN" }
```

---

## 🔧 Troubleshooting

### Error: "Firebase Admin SDK not configured"
- ✅ Check all 5 environment variables are set in Render
- ✅ Verify `FIREBASE_PRIVATE_KEY` includes `\n` characters
- ✅ Check Render logs for specific error messages

### Error: "PERMISSION_DENIED: Cloud Firestore API has not been used"
- ✅ Go to Google Cloud Console
- ✅ Enable **Cloud Firestore API**
- ✅ Wait 2-3 minutes for propagation

### Error: "Firebase: Error (auth/invalid-credential)"
- ✅ Check frontend Firebase config environment variables
- ✅ Verify Email/Password is enabled in Firebase Console
- ✅ Check that user exists in Firebase Authentication

### Error: "Firebase service account not found"
- ✅ Make sure `FIREBASE_PRIVATE_KEY` is set (not empty)
- ✅ Check that private key is properly formatted
- ✅ Verify no extra spaces or quotes around the key

---

## 📝 Quick Checklist

- [ ] Firebase Service Account JSON downloaded
- [ ] 5 Firebase environment variables added to Render
- [ ] `FIREBASE_PRIVATE_KEY` includes `\n` characters
- [ ] Firestore Database created and enabled
- [ ] Firestore API enabled in Google Cloud Console
- [ ] Email/Password authentication enabled
- [ ] Frontend Firebase config variables set (if deploying frontend)
- [ ] Render service redeployed after adding variables
- [ ] Logs show "✅ Firebase Admin initialized"

---

## 🎉 Success!

Once configured, Firebase will work in both:
- ✅ Local development (using JSON file or env vars)
- ✅ Production deployment (using environment variables)

Your backend will automatically use environment variables when deployed, and fall back to local files when developing locally.

