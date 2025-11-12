import { adminAuth, adminDb } from '../config/firebase.js';

// Get user profile from Firestore
export async function getProfile(req, res) {
  try {
    const userId = req.firebaseUid;
    
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      user: {
        uid: userId,
        ...userData
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching profile',
      details: error.message
    });
  }
}

// Create or update user document in Firestore (called after signup)
export async function createUserDocument(req, res) {
  try {
    const { uid, username, email, displayName } = req.body;

    // Verify the token matches the uid
    if (req.firebaseUid !== uid) {
      return res.status(403).json({
        error: true,
        message: 'User ID mismatch'
      });
    }

    // Check if user document already exists
    const userDoc = await adminDb.collection('users').doc(uid).get();
    
    if (userDoc.exists) {
      // Document exists - don't update on login, only verify
      // Only update if called from signup (when username/email might be new)
      const existingData = userDoc.data();
      
      // Only update if email changed (shouldn't happen, but safety check)
      if (email && existingData.email !== email) {
        await adminDb.collection('users').doc(uid).update({
          email: email,
          updatedAt: new Date().toISOString()
        });
        console.log(`✅ Updated email in Firestore user document for: ${uid}`);
      } else {
        console.log(`✅ Firestore user document exists for: ${uid} (no update needed)`);
      }
    } else {
      // Create new document (only for new signups or old users without documents)
      await adminDb.collection('users').doc(uid).set({
        username: username || email?.split('@')[0] || 'User',
        email: email,
        displayName: displayName || username || email?.split('@')[0] || 'User',
        createdAt: new Date().toISOString(),
        studyHistory: []
      });
      
      console.log(`✅ Created new Firestore user document for: ${uid}`);
    }

    res.json({
      success: true,
      message: 'User document created/updated successfully'
    });

  } catch (error) {
    console.error('Create user document error:', error);
    
    // Check if Firestore API is not enabled
    if (error.code === 7 || error.message?.includes('SERVICE_DISABLED') || error.message?.includes('Firestore API')) {
      return res.status(503).json({
        error: true,
        message: 'Firestore API is not enabled',
        details: 'Please enable Cloud Firestore API in Google Cloud Console',
        helpUrl: 'https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=prasf-3c29f',
        instructions: 'Visit the link above and click "Enable", then wait 1-2 minutes and try again.'
      });
    }
    
    res.status(500).json({
      error: true,
      message: 'Error creating user document',
      details: error.message,
      code: error.code
    });
  }
}

