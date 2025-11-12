import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function LandingPage({ onGetStarted }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to load user:', e);
      }
    }
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-nav">
        {user ? (
          <div className="landing-nav-user">
            <span className="landing-nav-username">👤 {user.username}</span>
            <button
              className="landing-nav-button"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="landing-nav-buttons">
            <a href="/login" className="landing-nav-button secondary">
              Login
            </a>
            <a href="/signup" className="landing-nav-button primary">
              Sign Up
            </a>
          </div>
        )}
      </div>
      <div className="landing-hero">
        <div className="landing-content">
          <h1 className="landing-title">
            <span className="landing-icon">🎓</span>
            Smart Study Assistant
          </h1>
          <p className="landing-subtitle">
            AI-Powered Learning Made Simple
          </p>
          <p className="landing-description">
            Transform your study sessions with intelligent summaries, interactive quizzes, 
            and personalized study tips powered by advanced AI technology.
          </p>
          
          <div className="landing-features">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Smart Summaries</h3>
              <p>Get concise, AI-generated summaries of any topic</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❓</div>
              <h3>Interactive Quizzes</h3>
              <p>Test your knowledge with AI-generated questions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Study Tips</h3>
              <p>Receive personalized tips for effective learning</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔢</div>
              <h3>Math Mode</h3>
              <p>Solve quantitative problems with step-by-step solutions</p>
            </div>
          </div>

          <div className="landing-actions">
            {user ? (
              <button className="landing-button primary" onClick={handleGetStarted}>
                Continue Studying →
              </button>
            ) : (
              <>
                <button className="landing-button primary" onClick={() => router.push('/signup')}>
                  Get Started Free
                </button>
                <button className="landing-button secondary" onClick={() => router.push('/login')}>
                  Sign In
                </button>
              </>
            )}
          </div>

          <div className="landing-stats">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Topics Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">AI</div>
              <div className="stat-label">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

