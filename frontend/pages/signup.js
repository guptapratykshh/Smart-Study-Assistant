import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import styles from '../styles/Auth.module.css';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      console.log('✅ Firebase Auth user created:', user.uid);

      // Get Firebase ID token first (this is critical for authentication)
      const token = await user.getIdToken();
      console.log('✅ Firebase token obtained');

      // Create user document in Firestore via backend (bypasses security rules)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        const response = await fetch(`${API_URL}/api/firebase/create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            uid: user.uid,
            username: formData.username,
            email: formData.email,
            displayName: formData.username
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Firestore user document created via backend:', data.message);
        } else {
          const errorData = await response.json();
          console.error('⚠️ Backend Firestore error:', errorData);
          
          // Check if Firestore API is not enabled
          if (errorData.details?.includes('Firestore API') || errorData.details?.includes('SERVICE_DISABLED')) {
            console.warn('⚠️ Firestore API not enabled. User will be created on first login.');
            console.warn('📖 Enable it here:', errorData.helpUrl || 'https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=prasf-3c29f');
          } else {
            // Try frontend Firestore as fallback
            try {
              await setDoc(doc(db, 'users', user.uid), {
                username: formData.username,
                email: formData.email,
                displayName: formData.username,
                createdAt: new Date().toISOString(),
                studyHistory: []
              });
              console.log('✅ Firestore user document created via frontend fallback');
            } catch (fallbackError) {
              console.error('⚠️ Frontend Firestore fallback also failed:', fallbackError);
              console.warn('⚠️ User is authenticated but Firestore document will be created on first login');
            }
          }
        }
      } catch (backendError) {
        console.error('⚠️ Backend request failed, trying frontend Firestore:', backendError);
        // Fallback to frontend Firestore
        try {
          await setDoc(doc(db, 'users', user.uid), {
            username: formData.username,
            email: formData.email,
            displayName: formData.username,
            createdAt: new Date().toISOString(),
            studyHistory: []
          });
          console.log('✅ Firestore user document created via frontend fallback');
        } catch (fallbackError) {
          console.error('⚠️ Frontend Firestore fallback also failed:', fallbackError);
          // Continue anyway - user is authenticated, document can be created on login
        }
      }

      // Store user data and token
      const userInfo = {
        uid: user.uid,
        email: user.email,
        username: formData.username,
        displayName: formData.username
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('firebaseUid', user.uid);
      
      console.log('✅ User data stored, redirecting...');
      
      // Clear loading state before redirect
      setLoading(false);
      
      // Redirect to home page with a small delay to ensure state is updated
      setTimeout(() => {
        router.push('/');
      }, 100);
    } catch (err) {
      console.error('Signup error:', err);
      setLoading(false);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authForm}>
        <h1 className={styles.title}>SIGN UP</h1>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>👤</span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>✉️</span>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>

          <div className={styles.divider}></div>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <a href="/login" className={styles.link}>Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

